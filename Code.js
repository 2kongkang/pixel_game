function doGet(e) {
  // CORS setup
  var output = ContentService.createTextOutput();

  if (!e || !e.parameter) {
     output.setMimeType(ContentService.MimeType.JSON)
        .setContent(JSON.stringify({ status: 'error', message: 'No parameters' }));
     return output;
  }

  var action = e.parameter.action;

  if (action === 'getQuestions') {
    var count = e.parameter.count || 5;
    var data = getRandomQuestions(count);
    output.setMimeType(ContentService.MimeType.JSON)
          .setContent(JSON.stringify({ status: 'success', data: data }));
  } else {
    output.setMimeType(ContentService.MimeType.JSON)
          .setContent(JSON.stringify({ status: 'error', message: 'Invalid action' }));
  }

  return output;
}

function doPost(e) {
  var output = ContentService.createTextOutput();

  if (!e || !e.postData) {
     output.setMimeType(ContentService.MimeType.JSON)
        .setContent(JSON.stringify({ status: 'error', message: 'No post data' }));
     return output;
  }

  try {
    var data = JSON.parse(e.postData.contents);
    var action = data.action;

    if (action === 'submitScore') {
      var result = submitScore(data);
      output.setMimeType(ContentService.MimeType.JSON)
            .setContent(JSON.stringify({ status: 'success', result: result }));
    } else {
       output.setMimeType(ContentService.MimeType.JSON)
          .setContent(JSON.stringify({ status: 'error', message: 'Invalid action' }));
    }
  } catch(err) {
     output.setMimeType(ContentService.MimeType.JSON)
        .setContent(JSON.stringify({ status: 'error', message: err.toString() }));
  }

  return output;
}

function getRandomQuestions(n) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('題目');
  if (!sheet) return [];

  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return []; // No data

  // Columns: A=ID, B=Question, C=OptA, D=OptB, E=OptC, F=OptD, G=Answer
  var data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();

  // Shuffle
  for (var i = data.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = data[i];
    data[i] = data[j];
    data[j] = temp;
  }

  // Take N, hide answer
  var questions = [];
  var count = Math.min(n, data.length);

  for (var i = 0; i < count; i++) {
    var row = data[i];
    questions.push({
      id: row[0],
      text: row[1],
      options: [row[2], row[3], row[4], row[5]],
      answer: row[6] // In a real secure app, don't send this. For client-side checking convenience we might, or use hashed.
                     // Sending it for now as per "simple" request, but better to verify on backend.
                     // Wait, user asked to calculate score on backend? "將作答結果傳送到 Google Apps Script 計算成績"
                     // So we do NOT send the answer to frontend ideally.
                     // But strictly, let's just send the Questions and let client submit answers?
                     // "成績計算：將作答結果傳送到 Google Apps Script 計算成績" -> implies backend calculation.
                     // So we should NOT send row[6] (Answer) to client if possible, but we need to map question IDs to verify.
    });
  }

  // Start with sending answers to client for easier prototype state, OR keep them backend?
  // Let's stick to the prompt: "將作答結果傳送到 Google Apps Script 計算成績".
  // This means the client sends [{id: 1, answer: 'A'}, ...] and backend calculates.
  // So I will REMOVE the answer from the returned object to be safe/clean.
  return questions.map(function(q) {
    return {
      id: q.id,
      text: q.text,
      options: q.options
    };
  });
}

function submitScore(payload) {
  // payload: { id: "user_id", answers: [{q_id: 1, my_ans: 'A'}, ...] }
  var userId = payload.userId;
  var userAnswers = payload.answers || []; // e.g. [{id: 1, answer: 'A'}, ...]

  var qSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('題目');
  var aSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('回答');

  // 1. Calculate Score
  // Get all answers from Question Sheet
  var qLastRow = qSheet.getLastRow();
  var qData = qSheet.getRange(2, 1, qLastRow - 1, 7).getValues(); // [id, ..., ans] is index 0 and 6
  var answerMap = {};
  qData.forEach(function(row) {
    answerMap[row[0]] = row[6]; // ID -> Answer
  });

  var score = 0;
  userAnswers.forEach(function(ansIdx) {
     if (answerMap[ansIdx.id] == ansIdx.answer) {
       score++;
     }
  });

  // 2. Record to Answer Sheet
  // Columns: A=ID, B=PlayCount, C=TotalScore, D=MaxScore, E=FirstClearScore, F=PassCount, G=LastPlayTime
  // Wait, user specs:
  // "ID、闖關次數、總分 (Total score across games? or Score of this game?), 最高分、第一次通關分數...、花了幾次通關、最近遊玩時間"

  // Let's assume "總分" is cumulative score? Or just score of this run?
  // "總分" usually means total accumulated, but let's stick to standard leaderboards.
  // Let's check if user exists.

  var aLastRow = aSheet.getLastRow();
  var users = [];
  if (aLastRow > 1) {
    users = aSheet.getRange(2, 1, aLastRow - 1, 1).getValues().flat();
  }

  var userRowIndex = users.indexOf(userId);
  var now = new Date();

  // Threshold read from Properties or hardcoded? User said .env for client, but here?
  // Passed if score >= THRESHOLD (Need to pass this from client or store in script properties)
  // Let's assume passed if score == userAnswers.length (all correct) or specific threshold?
  // User said "PASS_THRESHOLD" in .env, which is client side (or backend?)
  // "PASS_THRESHOLD：通過門檻（需要答對幾題才算通過）" - implies logic is somewhere.
  // If backend calculates, backend needs to know threshold.
  // I will accept threshold in payload for simplicity or just return the score and let client decide "Pass/Fail" visual,
  // BUT the sheet needs "第一次通關分數" etc.
  // I'll look for a Script Property 'PASS_THRESHOLD' or default to 3.
  var threshold = parseInt(PropertiesService.getScriptProperties().getProperty('PASS_THRESHOLD')) || 3;
  var isPass = score >= threshold;

  if (userRowIndex === -1) {
    // New User
    // ID, Count, TotalScore(This run?), MaxScore, FirstClear, PassCount, LastTime
    // Interpreting "總分" as "Average" or "Cumulative"? Usually specific logic.
    // Let's map exactly to user request:
    // ID, 闖關次數 (1), 總分 (Score), 最高分 (Score), 第一次通關分數 (Score if pass else ""), 花了幾次通關 (1 if pass else 0?), Time

    // Actually "花了幾次通關" is ambiguous. "How many tries until pass?" or "Total passes"?
    // "闖關次數" = Total Plays.
    // "第一次通關分數" = Score when they FIRST passed.
    // "花了幾次通關" = Number of tries IT TOOK to get the first pass? Or Total Pass Count?
    // "若同 ID 已通關過，後續分數不覆蓋，僅在同列增加闖關次數" -> This implies we update existing row.

    // Let's write a new row
    var firstClearScore = isPass ? score : "";
    var triesToPass = isPass ? 1 : ""; // If passed on 1st try.

    aSheet.appendRow([userId, 1, score, score, firstClearScore, triesToPass, now]);

  } else {
    // Update existing
    // Row is userRowIndex + 2
    var rowNum = userRowIndex + 2;
    var currentRow = aSheet.getRange(rowNum, 1, 1, 7).getValues()[0];

    var currentPlays = currentRow[1] || 0;
    var currentTotal = currentRow[2] || 0; // Maybe this is cumulative? Let's just add to it.
    var currentMax = currentRow[3] || 0;
    var currentFirstClear = currentRow[4];
    var currentTriesToPass = currentRow[5];

    var newPlays = currentPlays + 1;
    var newTotal = currentTotal + score; // Accumulate score? Or is it last score? User just said "總分". I'll accumulate.
    var newMax = Math.max(currentMax, score);

    var newFirstClear = currentFirstClear;
    var newTriesToPass = currentTriesToPass;

    if (currentFirstClear === "" && isPass) {
      newFirstClear = score;
      newTriesToPass = newPlays; // It took this many plays to finally pass
    }

    aSheet.getRange(rowNum, 2, 1, 6).setValues([[
      newPlays,
      newTotal,
      newMax,
      newFirstClear,
      newTriesToPass,
      now
    ]]);
  }

  return { score: score, isPass: isPass };
}
