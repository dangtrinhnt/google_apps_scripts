// SCRIPT NAME: Generate Google Form from Google SpreadSheet
// AUTHOR: Trinh Nguyen (http://me.dangtrinh.com)
// VERSION: 0.1
// LAST UPDATED: Fri, Sep 15, 2015

FORM_NAME = '<YOUR_FORM_NAME>';
DATA_SPREADSHEET_ID = '<DATA_SPREADSHEET_ID>';
TEACHER_SHEET = 'teachers';
COURSE_SHEET = 'courses';




// dictionary of columns (list)
// thedict = {'<col_header0>': ['<row0>','<row1>',...], '<col_header1>': ['<row0', '<row1>',...]...}
function sheet_to_dict(spreadsheetid, sheetname) {
  var result_list = {};
  var dataspreadsheet = SpreadsheetApp.openById(spreadsheetid);
  var sheet = dataspreadsheet.getSheetByName(sheetname);
  var cols = sheet.getLastColumn();
  var rows = sheet.getLastRow();

  var data = sheet.getDataRange().getValues();
  // data[row][col]

  for (var c = 0; c < cols; c++) {
    var header = data[0][c];
    var col_data_list = [];
    for(var r = 1; r < rows; r++) {
      var cell_data = data[r][c];
      if(cell_data !== ''){
        col_data_list.push(cell_data);
      }
    }
    if (col_data_list.length > 0) {
      result_list[data[0][c]] = col_data_list;
    }
  }
  return result_list;
}

function gen_form_from_sheet(form_name, spreadsheet_id, teacher_sheet, course_sheet) {
  var teacher_data = sheet_to_dict(spreadsheet_id, teacher_sheet);
  var course_data = sheet_to_dict(spreadsheet_id, course_sheet);

  var form = FormApp.create(form_name);

  // select a school: es, ms or hs
  var school_choices = form.addMultipleChoiceItem().setTitle('In what part of the school are you a student?');

  // create the final page where student submitting feedback
  var feedback_page = form.addPageBreakItem().setTitle('Core value feedback');
  form.addSectionHeaderItem().setTitle('Academic Excellence');
  var a1 = form.addMultipleChoiceItem().setTitle('My teacher provides a challenging academic program.');
  a1.setChoiceValues(['Strongly Disagree', 'Disagree', 'Agree', 'Strongly Agree']);
  a1.setRequired(true);
  var a2 = form.addMultipleChoiceItem().setTitle('My teacher includes both individual and collaborative learning experiences.');
  a2.setChoiceValues(['Strongly Disagree', 'Disagree', 'Agree', 'Strongly Agree']);
  a2.setRequired(true);
  var a3 = form.addMultipleChoiceItem().setTitle('My teacher focuses on both building knowledge of the world and developing critical thinking skills.');
  a3.setChoiceValues(['Strongly Disagree', 'Disagree', 'Agree', 'Strongly Agree']);
  a3.setRequired(true);
  var a4 = form.addParagraphTextItem().setTitle('Please add any comments related to ACADEMIC EXCELLENCE.');
  a4.setHelpText('Strengths and areas for improvement are both welcome.');
  a4.setRequired(true);
  form.addSectionHeaderItem().setTitle('Sense of Self');
  var s1 = form.addMultipleChoiceItem().setTitle('My teacher helps me develop my own strong sense of character.');
  s1.setChoiceValues(['Strongly Disagree', 'Disagree', 'Agree', 'Strongly Agree']);
  s1.setRequired(true);
  form.addSectionHeaderItem().setTitle('Balance in Life');
  var b1 = form.addMultipleChoiceItem().setTitle('My teacher respects, and helps me balance, the many different priorities in my life.');
  b1.setChoiceValues(['Strongly Disagree', 'Disagree', 'Agree', 'Strongly Agree']);
  b1.setRequired(true);
  form.addSectionHeaderItem().setTitle('Dedicated Service');
  var d1 = form.addMultipleChoiceItem().setTitle('My teacher encourages me to give service to the community.');
  d1.setChoiceValues(['Strongly Disagree', 'Disagree', 'Agree', 'Strongly Agree']);
  d1.setRequired(true);
  form.addSectionHeaderItem().setTitle('Respect for all');
  var r1 = form.addMultipleChoiceItem().setTitle('My teacher treats me with respect.');
  r1.setChoiceValues(['Strongly Disagree', 'Disagree', 'Agree', 'Strongly Agree']);
  r1.setRequired(true);
  var r2 = form.addMultipleChoiceItem().setTitle('My teacher treats others with respect.');
  r2.setChoiceValues(['Strongly Disagree', 'Disagree', 'Agree', 'Strongly Agree']);
  r2.setRequired(true);

  //feedback_page.setGoToPage(FormApp.PageNavigationType.SUBMIT);
  var submit_page = form.addPageBreakItem().setTitle('Submit your feedback');
  submit_page.setGoToPage(FormApp.PageNavigationType.SUBMIT);

  // create a page to select es teacher
  var es_page = form.addPageBreakItem().setTitle('Elementary (up to grade 5)');
  var es_teachers = form.addListItem().setTitle('You are giving feedback on which elementary teacher?');
  var es_teacher_choices = []
  for each (var t in teacher_data['es']) {
    // then create a page to select a course of t teacher
    var es_course_page = form.addPageBreakItem().setTitle('Teacher feedback for ' + t);
    var es_courses = form.addListItem().setTitle('You are giving feedback on which course of the selected teacher?');
    var es_course_choices = []
    for each (var c in course_data[t]) {
      var es_cc = es_courses.createChoice(c, feedback_page);
      es_course_choices.push(es_cc);
    }
    es_courses.setChoices(es_course_choices);
    es_courses.setRequired(true);

    var est = es_teachers.createChoice(t, es_course_page);
    es_teacher_choices.push(est);
  }
  es_teachers.setChoices(es_teacher_choices);
  es_teachers.setRequired(true);

  // create a page to select ms teacher
  var ms_page = form.addPageBreakItem().setTitle('Middle school (grades 6, 7, and 8)');
  var ms_teachers = form.addListItem().setTitle('You are giving feedback on which middle school teacher?');
  var ms_teacher_choices = []
  for each (var t in teacher_data['ms']) {
    // then create a page to select a course of t teacher
    var ms_course_page = form.addPageBreakItem().setTitle('Teacher feedback for ' + t);
    var ms_courses = form.addListItem().setTitle('You are giving feedback on which course of the selected teacher?');
    var ms_course_choices = []
    for each (var c in course_data[t]) {
      var ms_cc = ms_courses.createChoice(c, feedback_page);
      ms_course_choices.push(ms_cc);
    }
    ms_courses.setChoices(ms_course_choices);
    ms_courses.setRequired(true);

    var mst = ms_teachers.createChoice(t, ms_course_page);
    ms_teacher_choices.push(mst);
  }
  ms_teachers.setChoices(ms_teacher_choices);
  ms_teachers.setRequired(true);

  // create a page to select hs teacher
  var hs_page = form.addPageBreakItem().setTitle('High school (grades 9, 10, 11, and 12)');
  var hs_teachers = form.addListItem().setTitle('You are giving feedback on which high school teacher?');
  var hs_teacher_choices = []
  for each (var t in teacher_data['hs']) {
    // then create a page to select a course of t teacher
    var hs_course_page = form.addPageBreakItem().setTitle('Teacher feedback for ' + t);
    var hs_courses = form.addListItem().setTitle('You are giving feedback on which course of the selected teacher?');
    var hs_course_choices = []
    for each (var c in course_data[t]) {
      var hs_cc = hs_courses.createChoice(c, feedback_page);
      hs_course_choices.push(hs_cc);
    }
    hs_courses.setChoices(hs_course_choices);
    hs_courses.setRequired(true);

    var hst = hs_teachers.createChoice(t, hs_course_page);
    hs_teacher_choices.push(hst);
  }
  hs_teachers.setChoices(hs_teacher_choices);
  hs_teachers.setRequired(true);

  // now go back to the first page and add choices
  var es_choice = school_choices.createChoice('Elementary (up to grade 5)', es_page);
  var ms_choice = school_choices.createChoice('Middle school (grades 6, 7, and 8)', ms_page);
  var hs_choice = school_choices.createChoice('High school (grades 9, 10, 11, and 12)', hs_page);
  school_choices.setChoices([es_choice, ms_choice, hs_choice]);
  school_choices.setRequired(true);

  return form.getId();
}


function main() {

  new_form_id = gen_form_from_sheet(FORM_NAME, DATA_SPREADSHEET_ID, TEACHER_SHEET, COURSE_SHEET);

}
