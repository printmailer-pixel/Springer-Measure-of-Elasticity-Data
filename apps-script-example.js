function doPost(e) {
  try {
    // Parse the incoming JSON payload
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Create an array for the new row matching the Springer Measure of Elasticity (SME)
    const rowData = [
      new Date(), // Timestamp
      data.demographics.callSign || data.demographics.identifier || "",
      data.demographics.email || "",
      data.demographics.age || "",
      data.demographics.gender || "",
      data.demographics.role || "",
      data.demographics.status || "",
      data.demographics.years || "",
      data.demographics.leadership || "",
      data.demographics.military || "",
      data.demographics.setting || "",
      data.scores.springer || 0,
      data.scores.springerInterpretation || "",
      data.scores.springerDescription || ""
    ];
    
    // Append the data to the sheet
    sheet.appendRow(rowData);
    
    // Send email with scores if an email was provided
    if (data.demographics.email) {
      sendResultsEmail(data);
    }
    
    // Check if we need to flag concerning scores
    checkConcerningScores(data);
    
    return ContentService.createTextOutput(JSON.stringify({ "success": true, "message": "Data received successfully" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "success": false, "message": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendResultsEmail(data) {
  const email = data.demographics.email;
  const identifier = data.demographics.callSign || data.demographics.identifier || "Participant";
  const subject = "Your THIN LINE ADVISORY - Springer Measure of Elasticity Results";
  
  let body = "Thank you for completing the Springer Measure of Elasticity (SME).\n\n";
  body += "Identifier / Call Sign: " + identifier + "\n";
  body += "Total Score: " + data.scores.springer + " / 60\n";
  body += "Classification: " + data.scores.springerInterpretation + "\n\n";
  body += "Clinical Feedback:\n" + data.scores.springerDescription + "\n\n";
  body += "Want to 'sidebar' about this or anything else we covered today?\n";
  body += "Email: Doc@thinlineadvisory.com\n\n";
  body += "Resources for support:\n";
  body += "- 988 Suicide & Crisis Lifeline: https://988lifeline.org (Call or text 988)\n";
  body += "- Veterans Crisis Line: https://www.veteranscrisisline.net (Dial 988, Press 1)\n";
  body += "- Fortitude Recovery: https://www.fortituderecovery.com/\n";
  body += "- ResponderStrong: https://responderstrong.org\n\n";
  body += "Springer Measure of Elasticity (SME); 2025. All rights reserved.";
  
  MailApp.sendEmail(email, subject, body);
}

function checkConcerningScores(data) {
  // Flag severe dysregulation (score 49-60)
  if (data.scores.springer >= 49) {
    const adminEmail = "Doc@thinlineadvisory.com"; 
    const subject = "ALERT: Severely Dysregulated SME Score - " + (data.demographics.callSign || "Unknown");
    
    let body = "A respondent has submitted an SME assessment indicating severe dysregulation.\n\n";
    body += "Call Sign / Identifier: " + (data.demographics.callSign || "Not provided") + "\n";
    body += "Email: " + (data.demographics.email || "Not provided") + "\n";
    body += "Score: " + data.scores.springer + " / 60 (" + data.scores.springerInterpretation + ")\n";
    body += "Role: " + (data.demographics.role || "N/A") + "\n";
    body += "Status: " + (data.demographics.status || "N/A") + "\n";
    body += "Years: " + (data.demographics.years || "N/A") + "\n";
    body += "Military: " + (data.demographics.military || "N/A") + "\n";
    
    MailApp.sendEmail(adminEmail, subject, body);
  }
}
