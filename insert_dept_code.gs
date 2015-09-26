// SCRIPT NAME: Insert department code when submitting
// AUTHOR: Trinh Nguyen (http://me.dangtrinh.com)
// VERSION: 0.1
// LAST UPDATED: Fri, Sep 15, 2015


DATA_SPREADSHEET_ID = '<DATA_SPREADSHEET_ID>';
DEPT_SHEET = 'depts';
RESPONSE_SPREADSHEET_ID = '<RESPONSE_SPREADSHEET_ID>';
RESPONSE_SHEET = 'responses';




function get_feedback_course(response_data, cols, last_row_index, course_question){
  var course = '';
  for (var c=0; c < cols; c++) {
    var header = response_data[0][c];
    var cell_val = response_data[last_row_index][c];
    if(header==course_question && cell_val !== '') {
      course = cell_val;
      break;
    }
  }
  return course;
}

// list of dictionaries
// thelist = [{'<col1_header>': '<val1>', '<col2_header>': '<val2>',...}, {'<col1_header>': '<val3>', '<col2_header>': '<val4>',..},...]
function sheet_to_list(spreadsheetid, sheetname) {
  var result_list = []

  var ss = SpreadsheetApp.openById(spreadsheetid);
  var sheet = ss.getSheetByName(sheetname);
  var data = sheet.getDataRange().getValues();

  var cols = sheet.getLastColumn();
  var rows = sheet.getLastRow();
  for (var r=1; r<rows; r++) {
    var row = {};
    for (var c=0; c<cols; c++) {
      row[data[0][c]] = data[r][c];
    }
    result_list.push(row);
  }
  return result_list;
}

function get_dept_code(dept_list, course_name) {
  var dept_code = '';
  for each (var d in dept_list) {
    if(d['course']==course_name) {
      dept_code = d['dept'];
      break;
    }
  }
  return dept_code;
}

function insert_dept_code() {
  var resp_ss = SpreadsheetApp.openById(RESPONSE_SPREADSHEET_ID);
  var resp_sheet = resp_ss.getSheetByName(RESPONSE_SHEET);
  var resp_data = resp_sheet.getDataRange().getValues();

  var cols = resp_sheet.getLastColumn();
  var rows = resp_sheet.getLastRow(); // last row index (zero-based)
  var last_row_index = rows - 1;
  var dept_cell = resp_sheet.getRange(rows, cols); // range is 1 index based

  var feedback_course = get_feedback_course(resp_data, cols, last_row_index, 'You are giving feedback on which course of the selected teacher?');
  var depts = sheet_to_list(DATA_SPREADSHEET_ID, DEPT_SHEET);
  var dept_code = get_dept_code(depts, feedback_course);

  dept_cell.setValue(dept_code);
}
