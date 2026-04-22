//var f_data = data.js1;
//d3.select('#toggle').remove();

var x = document.getElementById("toggle");
var x1 = document.getElementById("toggle1");
var isAuthenticated = false;


//var x2 = document.getElementById("toggle_answer");
if(x){
  x.style.display = "none";

}
if(document.getElementById("ok")){
  document.getElementById("ok").onclick = function(){get_ready()};
}

if(document.getElementById("upload")){
  document.getElementById("upload").onclick = function(){get_ready()};
}

if(document.getElementById("cancel")){
  document.getElementById("cancel").onclick = function(){get_ready()};
}


if(document.getElementById("get_form_answer") || document.getElementById("close_form") ){
  var form_button_1 = document.getElementById("get_form_answer");
  var form_button_2 = document.getElementById("close_form");
  form_button_1.style.display = "none";
  form_button_2.style.display = "none";
}

//document.getElementById("cancel").onclick = function(){get_ready()};
function get_ready(){
  //d3.select(document.getElementById("toggle")).remove();
  x1.style.display = "none";
  all();

 // x2.style.display = "none";
  //d3.select(document.getElementById("toggle")).append("toggle");
}
var active_block, current_validation;
var f_data= data;

var answers_object = {
                        answers:[

                        ],
                        uploads: {},
                        blockAnswers: {}
                      };

var objects = {
    questions:[],
    blocks:[]
}
var blocks_object = {
                        blocks:[

                        ]
                      };



var clicks_object = {
                        blocks:[

                        ]
                      };
var ans_data;

function f_count_questions(block_id){
  var related_questions = [];
  related_questions = find_related_questions(block_id);

 /* if(isNaN(related_questions)){
    related_questions = "";
    return(related_questions);
  }*/
//  console.log(related_questions.lengths)
 return(related_questions.length)
}

function f_count_answered_questions(block_id){
  var related_questions = [];
  related_questions = find_related_questions(block_id);
  var valid_counts = [];
  valid_counts = count_valid_answers(block_id, related_valid_answered_question);
  var invalid_counts = [];
  invalid_counts = count_invalid_answers(block_id, related_invalid_answered_question);
  var maybevalid_counts = [];
  maybevalid_counts = count_maybevalid_answers(block_id, related_maybeValid_answered_question);

  var answered_counts = valid_counts.length + invalid_counts.length + maybevalid_counts.length;

  if(isNaN(answered_counts)){
    answered_counts = "";
    return(answered_counts);
  }
 // redraw_nodes(mode_1)


 return(answered_counts);
}


function find_question_type (question_id){
  var question_type;
  for (var i in f_data.questions){
    if(f_data.questions[i].qs_id === question_id){
      question_type = f_data.questions[i].qs_type;
      return(question_type)
    }
  }
}

function find_question_feature (question_id){
  var question_feature;
  for (var i in f_data.questions){
    if(f_data.questions[i].qs_id === question_id){
      question_feature = f_data.questions[i].qs_feature;
      return(question_feature)
    }
  }
}

//auth btn
Shiny.addCustomMessageHandler('toggle_btn_state', function(state){
  if(state === "enable"){
    $("#editBlockBtn").removeAttr("disabled");
  //  $("#editBlockBtn").removeAttr("title");
   //$("#editBlockBtn").setAttribute("title", "Edit the block");
    document.getElementById("editBlockBtn").setAttribute("title", "Edit the block");
    $("#deleteBlockBtn").removeAttr("disabled");
  //  $("#deleteBlockBtn").removeAttr("title");
    document.getElementById("deleteBlockBtn").setAttribute("title", "Delete the block");

    $("#createNewBlockBtn").removeAttr("disabled");
   // $("#createNewBlockBtn").removeAttr("title");
    document.getElementById("createNewBlockBtn").setAttribute("title", "Create a new block");

    $("#createNewQuestionBtn").removeAttr("disabled");
   // $("#createNewQuestionBtn").removeAttr("title");
    document.getElementById("createNewQuestionBtn").setAttribute("title", "Create a new question");

    /*$editBtn.show();
    $deleteBtn.show();*/
    isAuthenticated = true;

    $(".table-action-mode").each(function(d, i) {
      let container = $('<div>', {
        style: "display:flex; flex-direction:column; justify-content:center; gap:5px"
      })


      let $editBtn  = $('<div><i class="fas fa-edit", id= "editBtn"></i></div>').appendTo(container);
      let $deleteBtn = $('<div><i class="fas fa-trash", id= "delBtn"></i></div>').appendTo(container);

      $editBtn.click( function (event) {
        event.stopPropagation()
        let questionId = $(this).closest('tr').attr("id")
        questionHandler.editQuestion(questionId)
        console.log("editBtn")
      })

      $deleteBtn.click( (event) => {
        event.stopPropagation()
        let questionId = $(this).closest('tr').attr("id")
        var choice = confirm("Are you sure to delete this question?");

        if (choice) {
          questionHandler.deleteQuestion(questionId)
          all();
          redrawGraph(f_data)
        }
      })

      $(this).append(container)
    })


    //all();


  }
})

// upload an already existing json project
Shiny.addCustomMessageHandler('file_load', function(load) {


  answers_object.answers = load.answers;
  answers_object["uploads"] = load.uploads;
  answers_object["blockAnswers"] = load.blockAnswers;
  //answers_object.blockAnswers = load.blockAnswers;


  previous_answers = {
    answers: load.answers
  }

  ans_data = {
    answers: load.answers
  }

  if(typeof(answers_object["blockAnswers"]) === "undefined") {

    answers_object["blockAnswers"] = {}
  }
  var uploads_arr = []
  for(var blockId in answers_object["blockAnswers"]) {
    let blockAnswerObj = answers_object["blockAnswers"][blockId]
    console.log(blockAnswerObj.block_name)
    //console.log(blockAnswerObj.validation)
    uploads_arr.push(blockAnswerObj.block_name)
 //   Shiny.setInputValue("manual_block",blockAnswerObj.block_name)
    manual_validation(blockId, blockAnswerObj.validation);
  }
  Shiny.setInputValue("manual_block",uploads_arr)

  if(typeof(load.f_data) != 'undefined') {
    f_data = load.f_data;
    answers_object["f_data"] = f_data
    redrawGraph(f_data)
}
  answers_object.answers.forEach((d) => {
    var qs_type = find_question_type (d.question_id)
    var qs_feature = find_question_feature(d.question_id)
    valid_node2('', d.question_id, d.answer, qs_type, qs_feature)
  })
  /*answers_object["blockAnswers"].forEach((d) => {
    console.log(d)
    //var block_id =
  })*/
  var send_json = JSON.stringify(answers_object)
  Shiny.setInputValue("send_json", send_json);

  update_pre_status();
  //sort_validations();
  draw_table_for_levels("all");
  svgContainer_rect.selectAll("g.node text.count_questions").each(function(d,i){
    d3.select(this)
    .text(function(d) {return f_count_questions(d.block_id)});
  })

svgContainer_rect.selectAll("g.node text.count_answered_questions").each(function(d,i){
    d3.select(this)
    .text(function(d) {return f_count_answered_questions(d.block_id)+" /"});
  })

  return

});


Shiny.addCustomMessageHandler('new_proj_created', function(load) {

       // x.style.display = "none";

});

var block_validity = {
                        blocks:[]
                      };


if(f_data){
  for(var data in f_data.blocks){
  block_validity.blocks.push({
    "block_id": f_data.blocks[data].block_id,
    "block_validity": "null",
    "dosage": null
  });

}
}

var related_valid_answered_question= [];
var related_invalid_answered_question= [];
var related_maybeValid_answered_question= [];
var related_no_validation_answered_question= [];
var unanswered_questions = [];
var unanswered_question;

// function to read the input answer and send it to js
var related_blocks = [];


if(document.getElementById("clear")){
  document.getElementById("clear").onclick = function (){clear_selection()};

}

if(document.getElementById("all_questions")){
  document.getElementById("all_questions").onclick = function (){
    //alert("clicked")
    all()};

}
if(document.getElementById("general_questions")){
  document.getElementById("general_questions").onclick = function (){
    //alert("clicked")
    general_level()};
}

if(document.getElementById("informative_questions")){
  document.getElementById("informative_questions").onclick = function (){
    //alert("clicked")
    informative()};
}

if(document.getElementById("remove_options") || document.getElementById("remove_input") ){
  //find the question_id
  document.getElementById("remove_options").onclick = function (){remove_options()};
  document.getElementById("remove_input").onclick = function (){remove_input()};
 // document.getElementById("remove_informative").onclick = function (){remove_informative()};

}

if(document.getElementById("modification")){
  document.getElementById("modification").onclick = function (){modification_button()};
}

function modification_button(){
  if(typeof clicked_node_block !== "undefined"){

            block_info.style.display = "block";
  }
}


function remove_options(){
  sort_validations();
  valid_node2(clicked_node, question_id, '', qs_type, qs_feature)
}
function remove_input(){
  sort_validations();
  valid_node2(clicked_node, question_id, '', qs_type, qs_feature)
}

function clear_selection(){

        Shiny.setInputValue("block_name", "Select a block");
        if(typeof selected_level_node !== "undefined"){
            selected_level_node.classed("selected_level_node", false);
          }
        if(typeof selected_node !== "undefined"){
                   selected_node.classed("selected_node", false);
                   x.style.display = "none";
                   clicked_node = undefined;

                 }
        if(selected_edge.length !== 0){
                      for(var ed in selected_edge){
                               selected_edge[ed].classed("related_edges", false);
                               selected_edge[ed].classed("related_valid_edges", false);
                               selected_edge[ed].classed("related_invalid_edges", false);
                               selected_edge[ed].classed("related_maybeValid_edges", false);
                            }
                      selected_edge.splice(0,selected_edge.length);
                    }

        if(selected_edge1.length !== 0){
                      for(var ed1 in selected_edge1){
                               selected_edge1[ed1].classed("related_edges", false);
                               selected_edge1[ed1].classed("related_valid_edges", false);
                               selected_edge1[ed1].classed("related_invalid_edges", false);
                               selected_edge1[ed1].classed("related_maybeValid_edges", false);
                            }
                      selected_edge1.splice(0,selected_edge1.length);
                    }
                    all();

      }


var answers_object1 = {
                        answers:[]
                      };

var permission;


//var clicked_node_array1 = [];
//clicked_node_array1.push(5);
var select_valid_node;


var clicked_node_array = [];
var clicked_node_cont;
var selected_node_tb= [];
var selected_valid_node_tb = [];
var selected_invalid_node_tb = [];
var selected_maybeValid_node_tb = [];
var answered_list=[];
//var x = document.getElementById("toggle");
//x.style.display = "none";
var comment;
var valid_ans ;
var affected_block_id;
var hide_comment;
//var valid_dosage;
if(document.getElementById("toggle_block_info")){
  var block_info= document.getElementById("toggle_block_info");
  block_info.style.display = "none";
}
if(document.getElementById("selected_block_toggle")){
  var hide_selected_block= document.getElementById("selected_block_toggle");
  hide_selected_block.style.display = "none";
}
if(document.getElementById("validation_toggle")){
  var hide_validation = document.getElementById("validation_toggle");
  hide_validation.style.display = "none";

}
if(document.getElementById("comment_toggle")){
  hide_comment = document.getElementById("comment_toggle");
  hide_comment.style.display = "none";

}
/*if(document.getElementById("dl")){
  var dl = document.getElementById("dl");
  dl.style.display = "none";

}*/
if(document.getElementById("loading")){
  var hide_loading = document.getElementById("loading");
  hide_loading.style.display = "none";

}




//save button
var question;
var answer ;
var dosage ;
var validity ;
var inselect ;
var input;
var selected_question_highlight;
//var answered_question;
var clicked_node_name;
var new_question;
var question_id;
var level_num;
var question_text;
var ans_qid_stored;
var ans_selection_stored;
var stored_validation;
var stored_dosage;
var stored_comment;
var get_question_id;
var get_question;
var get_answered;
var get_block;
var get_validation;
var get_comment;
var strength = 0;
var block = []
var validation = []

//var tmp_question;




function show_form(i, d){
  var question_type = find_question_type (d.qs_id)
 // Shiny.onInputChange("change_qs_type", question_type);

 Shiny.setInputValue("js_question_type", question_type);
 Shiny.setInputValue("question_type_direct", question_type);
 Shiny.onInputChange("ranges", " ");
 answer_def = [" "];
 Shiny.onInputChange("answer_options", answer_def);
 //Shiny.setInputValue("send_json", send_json);
 /*if(document.getElementById("question_type")){
  document.getElementById("question_type").value = question_type;
 }*/

  question_id = d.qs_id;
  level_num = d.Level;
  question_text = d.Question;
  //answered_question = d3.select(this);

  //alert(question_type)

 //update the raes here questioid a the block_id a the rae
  if(document.getElementById("comment_toggle") != null) {
    hide_comment =  document.getElementById("comment_toggle");
    hide_comment.style.display = "block";
  }

  form_button_1.style.display = "block";
  form_button_2.style.display = "block";
  add_row(i,d);

  //TODO fixMe

  var children = $(this).children();
  var lastChild = children[children.length - 1];
  var lastChild = $(this).find("td.main-cell")[0]
  add_row_element(lastChild, d);
  Shiny.onInputChange("ranges", "select a block");

//alert(this)
  valid_ans = undefined;
  x1.style.display = "block";
  hide_loading.style.display = "none";
 // dl.style.display = "none";
  var hide_qs_id = document.getElementById("question_id");
  var hide_qs_temp = document.getElementById("question_clicked_temp");
  //var hide_selected_block = document.getElementById("related_node");
  hide_qs_id.style.display = "none";
  hide_qs_temp.style.display = "none";
  //hide_selected_block.style.display = "none";

  svgContainer_rect.selectAll("g.node").each( function(d,i){
    d3.select(this).classed("related_nodes", false);
    d3.select(this).classed("related_valid_node", false);
    d3.select(this).classed("related_invalid_node", false);
    d3.select(this).classed("related_maybeValid_node", false);
  });
  svgContainer_rect.select("g.extended-level2").selectAll("g.node").each( function(d,i){
    d3.select(this).classed("related_nodes", false);
    d3.select(this).classed("related_valid_node", false);
    d3.select(this).classed("related_invalid_node", false);
    d3.select(this).classed("related_maybeValid_node", false);
  });

  if(selected_valid_node_tb.length !== 0){
        for(var dtn in selected_valid_node_tb){
                 selected_valid_node_tb[dtn].classed("related_valid_node", false);
              }
        selected_valid_node_tb.splice(0,selected_valid_node_tb.length);
        }
  if(selected_invalid_node_tb.length !== 0){
        for(var dtn in selected_invalid_node_tb){
                 selected_invalid_node_tb[dtn].classed("related_invalid_node", false);
              }
        selected_invalid_node_tb.splice(0,selected_invalid_node_tb.length);
        }
  if(selected_maybeValid_node_tb.length !== 0){
        for(var dtn in selected_maybeValid_node_tb){
                 selected_maybeValid_node_tb[dtn].classed("related_maybeValid_node", false);
              }
        selected_maybeValid_node_tb.splice(0,selected_maybeValid_node_tb.length);
        }



  if(typeof selected_question_highlight !== "undefined"){
            selected_question_highlight.classed("selected_question", false);
                 }
     selected_question_highlight = d3.select(this);
     selected_question_highlight.classed("selected_question", true);
    // tmp_question =d3.select(this);

  if(question_id === "47"){
      hide_loading.style.display = "block";
      x1.style.display = "block";
     // x2.style.display = "none";
      // Shiny.onInputChange("strength_update", "null");
    }
   /* if(level_num === "2"){
      dl.style.display = "block";
    }*/


    //here change style of d.question

    Shiny.setInputValue("question_clicked_temp", question_text);
    Shiny.setInputValue("question_id", question_id);
   // Shiny.onInputChange("answer_validation1", "null");


    var all_related_blocks = [];
    var all_valid_related_blocks =[];
    var all_maybeValid_related_blocks =[];
    var all_invalid_related_blocks = [];
    var answer_range = " "
    var answer_def = [];
    answer_def = [" "];
    comment = " ";
    valid_ans ="select";
   // valid_dosage = "select ";
    affected_block_id = " ";
    ans_selection_stored = "no previous answer";
    Shiny.onInputChange("question_clicked",question_id);
    Shiny.onInputChange("answer_options", answer_def);
    //Shiny.onInputChange("js_question_type", question_type);

  //  Shiny.onInputChange("answer_range", answer_range);
  //  shiny.onInputChange("remove_input", "")
    //Shiny.onInputChange("set_default", answer_def);
    if(document.getElementById("input_range")){
      var current_input = document.getElementById("input_range");
      var current_comment = document.getElementById("validation3");
      current_input.value = " ";
      current_comment.value = " ";
    }
  Shiny.onInputChange("answer_validation3", '');
  Shiny.onInputChange("answer_input", 'input ranges ');
  for(var t in answers_object.answers){

    var load_ans, load_comment, load_input;
        if(answers_object.answers[t].question_id == question_id){
          load_ans = answers_object.answers[t].answer;
          load_comment = answers_object.answers[t].comment;
          //load_input = answers_object.answers[t].input;
          Shiny.onInputChange("answer_validation3", load_comment);
          Shiny.onInputChange("answer_input", load_ans);
         // Shiny.onInputChange("answer_input", load_input);
         var current_input = document.getElementById("input_range");
         current_input.value = load_ans;
         //alert("loop")
        }
      }


  //  Shiny.onInputChange("answer_validation1", valid_ans);
   // Shiny.onInputChange("dosage_validation", valid_dosage);
    //Shiny.onInputChange("answer_validation4", all_related_blocks);
    Shiny.onInputChange("prev_answer", ans_selection_stored);
    Shiny.onInputChange("strength_update", "null");



    //changes highlights of related blocks according to different selected answer's validations
    //should replace this with find_validation_for_dl
//check question_type now

for(var q in f_data.questions){
  if(f_data.questions[q].qs_id === question_id){
    var qs_type = f_data.questions[q].qs_type;
    var input_details = input_details(question_id,qs_type, clicked_node_block);
  }

 for(var r in f_data.answers_concept_definition)
{
   if( f_data.answers_concept_definition[r].qs_id == question_id)
   {

     for(var b_id in f_data.answers_concept_definition[r].affected_dosage_blocks){
      //all_related_blocks[b_id] = f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].block_id;
       all_related_blocks.push(f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].block_id);

       if(f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].hasOwnProperty('dl')){
         // for here causes problem, doesnt function
       //  for(var n in f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].dl){
           // iterate over dls
           var dl_tmp = f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].dl;
          for(var p in f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers){

            if(f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity === "valid"){
           // alert(f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].dl  + "id: "+  f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].block_id)
              switch(qs_type){
                case 'option':
                  //add sub-block id
                   all_valid_related_blocks.push([f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].block_id,
                   f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].value,
                   f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity,
                   f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].dl]);

                  // f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].block_id+"_part_"+dl_tmp]);

                break;
                case 'range':
                   all_valid_related_blocks.push([f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].block_id,
                   f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].min,
                   f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].max,
                   f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity,
                   f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].dl]);

                break;
              }
            }
            if(f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity === "maybe_valid"){
              switch(qs_type){
               case 'option':
                 all_maybeValid_related_blocks.push([f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].block_id,
                  f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].value,
                  f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity,
                  f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].dl]);
               //   f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].block_id+"_part_"+dl_tmp]);

               break;
               case 'range':
                 all_maybeValid_related_blocks.push([f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].block_id,
                  f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].min,
                  f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].max,
                  f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity,
                  f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].dl]);

               break;
             }
            }
            if(f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity === "invalid"){
              switch(qs_type){
               case 'option':
                 all_invalid_related_blocks.push([f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].block_id,
                  f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].value,
                  f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity,
                  f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].dl]);

               break;
               case 'range':
                 all_invalid_related_blocks.push([f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].block_id,
                  f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].min,
                  f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].max,
                  f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity,
                  f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].dl]);

               break;
             }
            }
          }

       //  }

       }
       else{
        for(var p in f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers){

          if(f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity === "valid"){
            switch(qs_type){
              case 'option':

                 all_valid_related_blocks.push([f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].block_id,
                 f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].value,
                 f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity]);

              break;
              case 'range':
                 all_valid_related_blocks.push([f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].block_id,
                 f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].min,
                 f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].max,
                 f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity]);

              break;
            }
          }
          if(f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity === "maybe_valid"){
            switch(qs_type){
             case 'option':
               all_maybeValid_related_blocks.push([f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].block_id,
                f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].value,
                f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity]);

             break;
             case 'range':
               all_maybeValid_related_blocks.push([f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].block_id,
                f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].min,
                f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].max,
                f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity]);

             break;
           }
          }
          if(f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity === "invalid"){
            switch(qs_type){
             case 'option':
               all_invalid_related_blocks.push([f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].block_id,
                f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].value,
                f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity]);

             break;
             case 'range':
               all_invalid_related_blocks.push([f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].block_id,
                f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].min,
                f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].max,
                f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity]);

             break;
           }
          }
        }
       }
     }
   }
}


}



//
highlight_related_blocks( clicked_node_block, find_related_blocks(question_id));
function input_details(question_id, question_type, clicked_node){
    var validity, value, block_id;
    var related_blocks = []
    related_blocks = find_related_blocks(question_id);
    all_related_blocks =  find_related_blocks(question_id);
    var answer_def =[];
    var ranges = [];
    var selected_dl = 2;
    for(var a in f_data.answers_concept_definition){
      if(f_data.answers_concept_definition[a].qs_id === question_id){
        Shiny.onInputChange("js_question_type", question_type);
        for(var b in f_data.answers_concept_definition[a].affected_dosage_blocks){
          //check for all existing block_id s
         // for(var c in related_blocks){
            //check if dl exists in the related json object
            if(f_data.answers_concept_definition[a].affected_dosage_blocks[b].hasOwnProperty('dl')){
                // combine it with function get_result()
               // for(var c in f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers){
              //for(var dl in f_data.answers_concept_definition[a].affected_dosage_blocks[b].dl){
              if(f_data.answers_concept_definition[a].affected_dosage_blocks[b].dl === selected_dl){
                switch(question_type){
                  case 'range':
                    ////
                   // Shiny.onInputChange("ranges", "select a block to see the range");
                    if(f_data.answers_concept_definition[a].affected_dosage_blocks[b].block_id === clicked_node){
                      for(var d in f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers){
                        //no answer def, should get the input from the user
                        //should get numerical values the values, now should read min-max
                        ranges.push(f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers[d].value) ;
                        Shiny.onInputChange("ranges", ranges.slice(0, f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers.length));
                      }
                    }

                    ////



                    break;
                  case 'option':
                    //console.log("dl " + question_type)
                    for(var d in f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers){
                      answer_def.push(f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers[d].value);
                      //it reads the values, now should read min-max
                     // console.log("option value + " + f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers[d].value)
                      Shiny.onInputChange("answer_options", answer_def);
                    }
                    //should send options , Shiny.onInputChange("answer_options", answer_def);
                    break;
                  case 'calculation':
                    //should return some values
                    break;
                  default:
                    //alert("none")
                    break;
                }
            //  }
              //alert(related_blocks[c] + "dl exists" + f_data.answers_concept_definition[a].affected_dosage_blocks[b].dl )
            }
          }
        // }
            //if dl doesn't exists
            else{
              //for(var c in f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers){
                switch(question_type){
                 case 'range':
                  //Shiny.onInputChange("ranges", "select a block to see the range");
                  if(f_data.answers_concept_definition[a].affected_dosage_blocks[b].block_id === clicked_node){
                    for(var d in f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers){
                      //no answer def, should get the input from the user
                      //should get numerical values the values, now should read min-max
                      ranges.push(f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers[d].value) ;
                      Shiny.onInputChange("ranges", ranges.slice(0, f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers.length));
                    }
                  }

                  /*  ranges.push(f_data.answers_concept_definition[a].affected_dosage_blocks[0].possible_answers[c].value) ;
                    Shiny.onInputChange("ranges", ranges.slice(0, f_data.answers_concept_definition[a].affected_dosage_blocks[0].possible_answers.length));*/

               break;
                  case 'option':
                    for(var d in f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers){
                      answer_def.push(f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers[d].value);
                      //it reads the values, now should read min-max
                     // console.log("option value + " + f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers[d].value)
                      Shiny.onInputChange("answer_options", answer_def);
                    }

                    break;
                  default:
                    break;
               }
            // }

            //alert("dl not found")
            }
         // }
        }
      }
    }
}
// this function reacts to instant inputs in the form before saving them
function get_result(result){
  var selection_validity = result;
  var question_type;
  var valid_ans;

for(var r1 in f_data.answers_concept_definition)
{
if( f_data.answers_concept_definition[r1].qs_id == question_id)
{
  question_type = find_question_type(question_id);
 // alert(question_type);

  for( var o in f_data.answers_concept_definition[r1].affected_dosage_blocks)
     {
      if(f_data.answers_concept_definition[r1].affected_dosage_blocks[o].block_id == clicked_node){
        for( var s1 in f_data.answers_concept_definition[r1].affected_dosage_blocks[o].possible_answers){
          // get question type then if option, just check the selected option, if range, check the validity of the given answer to verify whether it is between the given range or not

          switch(question_type){
            case 'range':
           var given_ans = document.getElementById("input_range").value;
           var min_value = f_data.answers_concept_definition[r1].affected_dosage_blocks[o].possible_answers[s1].min;
           var max_value = f_data.answers_concept_definition[r1].affected_dosage_blocks[o].possible_answers[s1].max;
           var dl = f_data.answers_concept_definition[r1].affected_dosage_blocks[o].dl;
           affected_block_id = f_data.answers_concept_definition[r1].affected_dosage_blocks[o].block_id;
           comment = f_data.answers_concept_definition[r1].affected_dosage_blocks[o].possible_answers[s1].comment;
          // alert(given_ans + 'min: '+ min_value + 'max: '+ max_value)


           Shiny.onInputChange("answer_validation3", comment);

           //to be checked
           for(var t in answers_object.answers){
              var load_ans, load_comment, load_input;
                  if(answers_object.answers[t].question_id == question_id){
                    // load_ans = answers_object.answers[t].answer;
                    load_comment = answers_object.answers[t].comment;
                    load_input = answers_object.answers[t].answer;
                    Shiny.onInputChange("answer_validation3", load_comment);
                    Shiny.onInputChange("answer_input", load_input);
                  }
                }
            // send the validation of a given answer to the server.r

           Shiny.onInputChange("answer_input", given_ans);

           // evaluate the answer
         // if( min_value< given_ans < max_value){
          if( +min_value< +given_ans && +given_ans < +max_value){
            valid_ans = f_data.answers_concept_definition[r1].affected_dosage_blocks[o].possible_answers[s1].validity;
            Shiny.onInputChange("answer_validation1", valid_ans);
            //console.log("dl: "+ dl + " ans :" + (+given_ans) + 'min: '+ (min_value) + 'max: '+ ( max_value) + ' ' + (valid_ans))
            //find related blocks as well
           //related_blocks_validation(question_id, clicked_node,)
          }
          else{
            valid_ans = f_data.answers_concept_definition[r1].affected_dosage_blocks[o].possible_answers[s1].validity;
          }
           // evaluate the answer



            break;
            case 'informative':
              var given_ans = document.getElementById("input_text").value;
              affected_block_id = f_data.answers_concept_definition[r1].affected_dosage_blocks[o].block_id;
              comment = f_data.answers_concept_definition[r1].affected_dosage_blocks[o].possible_answers[s1].comment;
             // alert(given_ans + 'min: '+ min_value + 'max: '+ max_value)

              Shiny.onInputChange("answer_validation3", comment);

              //to be checked
              for(var t in answers_object.answers){
                 var load_ans, load_comment, load_input;
                     if(answers_object.answers[t].question_id == question_id){
                       // load_ans = answers_object.answers[t].answer;
                       load_comment = answers_object.answers[t].comment;
                       load_input = answers_object.answers[t].answer;
                       Shiny.onInputChange("answer_validation3", load_comment);
                       Shiny.onInputChange("answer_input", load_input);
                     }
                   }
               // send the validation of a given answer to the server.r

              Shiny.onInputChange("answer_input", given_ans);
             Shiny.onInputChange("answer_validation1", "unknown");
              // evaluate the answer
            break;
            case 'option':
            //case option
            if(f_data.answers_concept_definition[r1].affected_dosage_blocks[o].possible_answers[s1].value === selection_validity ){

              if(question_id === "470"){
                var strength;
                var concentration;
                var density;

                strength = document.getElementById("strength").value ;
                concentration = document.getElementById("concentration").value ;
                density = document.getElementById("density").value ;

                var tmp_validation = document.getElementById("validation1").value ;
                switch (selection_validity) {
                  case 'valid':
                    valid_ans = "valid"
                  break;

                  case 'invalid':
                    valid_ans = "invalid"
                  break;

                  case 'maybe_valid':
                    valid_ans = "maybe_valid"
                  break;

                  default:
                    valid_ans = "not found"
                }

              }
              else{
                  valid_ans = f_data.answers_concept_definition[r1].affected_dosage_blocks[o].possible_answers[s1].validity;
              }
              // check if question needs calculation then valid_ans might change
              // valid_dosage gets the dosage or now DL from each object
              // get d_loading and update the valid_dosage
              // **here**
               //valid_dosage = f_data.answers_concept_definition[r1].affected_dosage_blocks[o].affected_dosage;
               affected_block_id = f_data.answers_concept_definition[r1].affected_dosage_blocks[o].block_id;
               comment = f_data.answers_concept_definition[r1].affected_dosage_blocks[o].possible_answers[s1].comment;
               Shiny.onInputChange("answer_validation3", comment);
               Shiny.onInputChange("answer_input", '');

                for(var t in answers_object.answers){
                  var load_ans, load_comment, load_input;
                      if(answers_object.answers[t].question_id == question_id){
                       // load_ans = answers_object.answers[t].answer;
                        load_comment = answers_object.answers[t].comment;
                        load_input = answers_object.answers[t].answer;
                        Shiny.onInputChange("answer_validation3", load_comment);
                        Shiny.onInputChange("answer_input", load_input);
                      }

                    }
                // send the validation of a given answer to the server.r
               Shiny.onInputChange("answer_validation1", valid_ans);
             //  Shiny.onInputChange("dosage_validation", valid_dosage);

             }
            // end of case option
            break;
            default:
              break;

          }
          //alert(valid_ans)
          //return(valid_ans)
        }
      }
    }
}
}


}

///function
//this function shows temporary validation color changes when selecting an option or input a range within every question
function get_inselect_result1_tmp(result){
  var answer = result
 // var validation;
 var question_type = find_question_type(question_id);
 var qs_feature = find_question_feature(question_id)
  get_inselect_result1(answer, question_type, question_id, qs_feature)

}

function getQuestionRelatedBlocks(questionId, questionCondition, questionType, question_feature, checkDL) {
  let relatedQuestions = f_data.questions.filter((d) => d.qs_id === questionId)
  questionLevel = null
  if(relatedQuestions.length === 0) {
    console.log("something is wrong with JSON file definition")
  }
  else {
    questionLevel = relatedQuestions[0]["level_number"]
  }

  let classMapping = {
    "valid": "related_valid_node",
    "invalid": "related_invalid_node",
    "maybe_valid": "related_maybeValid_node"
  };
  var questionRelatedBlocks = f_data.answers_concept_definition.filter(d=>d.qs_id === questionId)
  if(questionRelatedBlocks.length > 0) {
    if(checkDL) {
      questionRelatedBlocks = questionRelatedBlocks[0].affected_dosage_blocks.filter(d=> typeof d.dl != "undefined");
    }
    else {
      questionRelatedBlocks = questionRelatedBlocks[0].affected_dosage_blocks.filter(d=> typeof d.dl === "undefined");
    }
  }
  questionRelatedBlocks = JSON.parse(JSON.stringify(questionRelatedBlocks));
  questionRelatedBlocks.forEach((d)=> {
    var answers = [];
    if(questionLevel === "dosage") {
      let drugLoading = questionCondition
      let validity = ""
      if( drugLoading < 50 ) {
        validity = "valid"
      }
      else if( drugLoading >= 50 && drugLoading <= 100 ) {
        validity = "maybe_valid"
      }
      else if(drugLoading > 100 ) {
        validity = "invalid"
      }
      if(validity != "") {
        answers.push({
          validity: validity
        })
      }
    }
    else {
      if(questionType === "option") {
        var answers = d.possible_answers.filter((answer)=> answer.value === questionCondition);
      }
      else if(questionType === "range") {
        questionCondition = parseFloat(questionCondition);
        var answers = d.possible_answers.filter((answer)=> questionCondition >= answer.min && questionCondition <= answer.max);
      }
    /*  else if(questionType === "informative") {
        var answers = "user input";
      }*/

    }

    if(answers.length === 0 ) {
      console.log("something is wrong with json definition: correct f_data")
      d.validity = "invalid";
      d.toAssignClass = classMapping["invalid"]
    }
    if(question_feature === "informative"){
      d.validity ="unknown"
    }
    else if(answers[0].validity) {
      d.validity = answers[0].validity;
      d.toAssignClass = classMapping[d.validity];
    }
    else{
      console.log("no validation found")
    }
  });
  return questionRelatedBlocks;
}

 function get_inselect_result1(result, question_type, question_id, question_feature){

        var change = result;

    //  change_for_extended_nodes(question_id, change, qs_type);

        var questionRelatedDLBlocks = getQuestionRelatedBlocks(question_id, result, question_type, question_feature,true);
        var questionRelatedNonDLBlocks = getQuestionRelatedBlocks(question_id, result, question_type, question_feature, false);

        var highlight= svgContainer_rect.selectAll("g.node").each(function(d,i){
          var blockWithAffectedDosage = null;
          if(d.level === "l2") {
            blockWithAffectedDosage = questionRelatedDLBlocks.filter((entry) => entry.block_id == d.block_id && entry.dl === d.dl );
          }
          else {
            blockWithAffectedDosage = questionRelatedNonDLBlocks.filter((entry) => entry.block_id == d.block_id );
          }
          if(blockWithAffectedDosage != null && blockWithAffectedDosage.length > 0 &&
            blockWithAffectedDosage[0].validity != "unknown" && blockWithAffectedDosage[0].validity != ""){
            d3.select(this).classed("related_nodes", false);
            d3.select(this).classed("related_valid_node", false);
            d3.select(this).classed("related_invalid_node", false);
            d3.select(this).classed("related_maybeValid_node", false);
            d3.select(this).classed(blockWithAffectedDosage[0].toAssignClass, true);
          }

        });

       return;


      }

Shiny.addCustomMessageHandler('inselect_change', get_inselect_result1_tmp );
//Shiny.addCustomMessageHandler('ans_qs', get_answer_qsId);
//this function finds all related blocks to a question
function highlight_related_blocks(clicked_node_block, all_related_blocks){

 if(typeof clicked_node_block !== "undefined"){
  clicked_node = clicked_node_block;
  hide_comment.style.display = "block";
  hide_selected_block.style.display = "block";
  for(var fb in f_data.blocks){
    if(f_data.blocks[fb].block_id == clicked_node){
      var related_node_name = f_data.blocks[fb].block_name;
      Shiny.setInputValue("related_node", related_node_name);
      //Shiny.setInputValue("block_name", related_node_name);
    }
  }
}
//if no node is selected, means one of the levels are selected
//shows related nodes
//else{
    hide_validation.style.display = "none";
    hide_comment.style.display = "none";
    hide_selected_block.style.display = "none";

    if(selected_node_tb.length !== 0){
      for(var dtn in selected_node_tb){

               selected_node_tb[dtn].classed("related_nodes", false);

            }
      selected_node_tb.splice(0,selected_node_tb.length);
    }

    if(selected_valid_node_tb.length !== 0){
      for(var dtn in selected_valid_node_tb){

               selected_valid_node_tb[dtn].classed("related_valid_node", false);

            }
      selected_valid_node_tb.splice(0,selected_valid_node_tb.length);
    }

    if(selected_invalid_node_tb.length !== 0){
      for(var dtn in selected_invalid_node_tb){

               selected_invalid_node_tb[dtn].classed("related_invalid_node", false);

            }
      selected_invalid_node_tb.splice(0,selected_invalid_node_tb.length);
    }

    if(selected_maybeValid_node_tb.length !== 0){
      for(var dtn in selected_maybeValid_node_tb){

               selected_maybeValid_node_tb[dtn].classed("related_maybeValid_node", false);

            }
      selected_maybeValid_node_tb.splice(0,selected_maybeValid_node_tb.length);
    }


    var highlight_blocks = svgContainer_rect.selectAll("g.node").each( function(d,i){

             for(var dt in all_related_blocks){
               if(d.block_id == all_related_blocks[dt]){
                selected_node_tb[dt] = d3.select(this);
               d3.select(this).classed("related_nodes", true);
            }

          }

        });

//}



}


             //------------------answers--------------------
       //check changed question
        Shiny.addCustomMessageHandler('changed_qs', function(new_qs) {
        new_question = new_qs;
        for(var qs in f_data.questions){
                   if(f_data.questions[qs].question == new_question){
                     question_id = f_data.questions[qs].qs_id;
                     }
                 }
              });


      //uploads the answer to already answered questions
      if(ans_data){
        for(var ans in ans_data.answers){
             if(ans_data.answers[ans].question_id == question_id){
               //css
               ans_qid_stored = ans_data.answers[ans].question_id ;
               ans_selection_stored = ans_data.answers[ans].answer;
               stored_comment = ans_data.answers[ans].comment;
               Shiny.onInputChange("prev_answer", ans_selection_stored);
               Shiny.onInputChange("prev_comment", stored_comment);

             }
            }
           }

        // upload already answered data
          for(var t in answers_object.answers){
            var load_ans, load_comment, load_input;
                if(answers_object.answers[t].question_id == question_id){
                  //load_ans = answers_object.answers[t].answer;
                  load_comment = answers_object.answers[t].comment;
                  load_input = answers_object.answers[t].answer;
                  Shiny.onInputChange("answer_validation3", load_comment);
                  Shiny.onInputChange("answer_input", load_input);
                }
              }

        //

    //  else{
        for(var i in tmp_array){
           if(tmp_array[i][0] === question_id){
              ans_qid_stored = tmp_array[i][0] ;
              ans_selection_stored = tmp_array[i][1] ;
              //alert(qid + ans_1);
              Shiny.onInputChange("prev_answer", ans_selection_stored);
            }

          }

     // }

       Shiny.addCustomMessageHandler('changed_node', function(new_node) {
        clicked_node_name = new_node;
         for(var node_name in f_data.blocks){
                     if(f_data.blocks[node_name].block_name == clicked_node_name){
                       clicked_node = f_data.blocks[node_name].block_id;
                       //alert(clicked_node)
                       }
                   }
       });
        //------------------answers--------------------



      Shiny.addCustomMessageHandler('ans', get_result );



      document.getElementById("get_form_answer").onclick = function (){get_shiny_answer()};
      function get_shiny_answer(){

        var answered_status =" ";

          if(typeof clicked_node !== "undefined"){
            clicked_node_const = clicked_node;
            clicked_node_array.push(clicked_node);

        }

         validity = document.getElementById("validation1").value;
       //  alert("option: " +  document.getElementById("inSelect").value + "range : "+  document.getElementById("input_range").value)
         if( document.getElementById("inSelect").value !== ""){
          inselect = document.getElementById("inSelect").value;
          answered_status = "yes"
         }

         if( document.getElementById("input_range").value !== ""){
          inselect = document.getElementById("input_range").value;
          answered_status = "yes"
         }

         /*if( document.getElementById("input_text").value !== ""){
          inselect = document.getElementById("input_text").value;
          answered_status = "yes"
         }*/

         else if(document.getElementById("inSelect").value === ""){
          inselect = ""
          answered_status = " "

         }
       //  input = document.getElementById("input").value;
         tmp_array.push([question_id,inselect]);
         //alert(tmp_array);
         get_comment = document.getElementById("validation3").value ;
         get_dosage = document.getElementById("dosage").value;
         if(question_id === "470" ){
           inselect = inselect+ "-" +
                      " Dosage Strength: "+ document.getElementById("strength").value +
                      " Concentration: "+ document.getElementById("concentration").value +
                      " Density: "+ document.getElementById("density").value +
                      " API Amount: "+ document.getElementById("api").value +
                      " Drug Loading: "+ document.getElementById("drug_loading").value +
                      " Excipient Amount: "+ document.getElementById("excipient").value ;
         }

        let relatedQuestions = f_data.questions.filter((d) => d.qs_id === question_id)
        let questionLevel = null
        if(relatedQuestions.length === 0) {
          console.log("something is wrong with JSON file definition")
        }
        else {
          questionLevel = relatedQuestions[0]["level_number"]
        }
        if(questionLevel === "dosage") {
          inselect = parseFloat(document.getElementById("drug_loading").value)
        }
        var tmp_flag;
        var tmp_index;
        //validation, block = find_current_validation(active_block)
        sort_validations();

        var qs_type = find_question_type (question_id)
        var qs_feature = find_question_feature (question_id)

        valid_node2(clicked_node, question_id, inselect, qs_type, qs_feature)

        if(inselect != "") {
          var questionRelatedDLBlocks = getQuestionRelatedBlocks(question_id, inselect, qs_type, qs_feature,true);
          var questionRelatedNonDLBlocks = getQuestionRelatedBlocks(question_id, inselect, qs_type, qs_feature, false);
          var questionRelatedBlocksMerged = questionRelatedDLBlocks.concat(questionRelatedNonDLBlocks)
          var blockIdList = questionRelatedBlocksMerged.map((d)=> d["block_id"])

          var blocksValdityStatus = questionRelatedBlocksMerged.map((d)=> d["validity"])
          var blockDLs = questionRelatedBlocksMerged.filter((d) => typeof d["dl"] != "undefined").map((d)=> d["dl"])
          var blockValidations = questionRelatedBlocksMerged.map((d) => {
            let validity = d["validity"];

            var validation = {
              block_id: d["block_id"],
              validity: validity,
              dl: typeof(d["dl"]) === "undefined" ? "undefined" : d["dl"]
            }
            return validation
          })

          var answerToQuestionIndex = answers_object.answers.findIndex((d) => d["question_id"] === question_id)
          var answerRecord = {
              "question_id": question_id,
              "qs_type": qs_type,
              "qs_feature" : qs_feature,
              "answer": inselect,
              "input": input,
              "comment" : get_comment,
              "time": Date() ,
              "block_id": blockIdList ,
              "block_validity": blocksValdityStatus,
              "validations": blockValidations
          }
          if(answerToQuestionIndex > -1) {
            answers_object.answers[answerToQuestionIndex] = answerRecord;
          }
          else {
            answers_object.answers.push(answerRecord);
          }
        }
        else {
          var questionAnswerIndex = answers_object.answers.findIndex((d) => d.question_id === question_id)
          if(questionAnswerIndex > -1) {
            answers_object.answers[questionAnswerIndex].validations.forEach((d) => {
              let selection = d.block_id;
              if(d.dl != "undefined") {
                selection = selection + "_part_" + d.dl;
              }
              selection = "g#" + selection + ".node"
              $(selection).removeClass("valid_node");
              $(selection).removeClass("invalid_node");
              $(selection).removeClass("maybeValid_node");
            })
            answers_object.answers.splice(questionAnswerIndex, 1);
          }
          answers_object.answers.forEach((d) => {
            valid_node2(clicked_node, d.question_id, d.answer, d.qs_type, d.qs_feature)
          })
        }
        set_status1(question_id,answered_status);

         var send_json = JSON.stringify(answers_object)
         Shiny.setInputValue("send_json", send_json);

         answered_list.push(question_id);
         stored_questions.push([question_id, inselect]);

         unanswered_questions.splice(0,unanswered_questions.length);
        sort_validations();

        var qs_type = find_question_type (question_id)
        var qs_feature = find_question_feature(question_id)

        valid_node2(clicked_node, question_id, inselect, qs_type, qs_feature)

        //validation is sorted
        block = find_current_validation(active_block)
        close_form();

        svgContainer_rect.selectAll("g.node text.count_questions").each(function(d,i){
                d3.select(this)
                .text(function(d) {return f_count_questions(d.block_id)});
              })

        svgContainer_rect.selectAll("g.node text.count_answered_questions").each(function(d,i){
                d3.select(this)
                .text(function(d) {return f_count_answered_questions(d.block_id)+" /"});
              })


      }

  document.getElementById("close_form").onclick = function (){close_form()};
}



//end of show_form

function find_related_blocks(question_id){
  var related_blocks = [];
  for(var r in f_data.answers_concept_definition)
       {
          if( f_data.answers_concept_definition[r].qs_id === question_id)
          {
            for(var b_id in f_data.answers_concept_definition[r].affected_dosage_blocks){
              related_blocks.push(f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].block_id);

            }
            //console.log(related_blocks)
            return(related_blocks);
          }
    }
}


// get dl as soon as it is changed and send it here, then find the related dl in the json and find the validation for the inSelect result
Shiny.addCustomMessageHandler('dl_change', dl_change );
function dl_change(dl_change){
      var drug_load = dl_change;
     // var answer = document.getElementById("inSelect").value;
    //alert( find_validation_for_dl(15, "DL < 5%" ,"Sensitive to mechanical stress" ,"30"))

  //alert(drug_load)

  return(drug_load)

}

//var uploads_info = [];
Shiny.addCustomMessageHandler('documentHasBeenUploaded', function(info) {
  if(typeof(answers_object.uploads) == "undefined") {
    answers_object["uploads"] = {}
  }
  //uploads_info = info;
  answers_object.uploads[info.blockName] = info.fileList
  var send_json = JSON.stringify(answers_object)
  Shiny.setInputValue("send_json", send_json);

});

Shiny.addCustomMessageHandler('documentUploadUpdate', function(info) {
  $(".input-group > input[type='text']").val();
  $("#attach_progress").css('visibility', 'hidden');
});

var selected_level_node;
function level_buttons(i,d){

if(typeof selected_level_node !== "undefined"){
    selected_level_node.classed("selected_level_node", false);
}
selected_level_node = d3.select(this);
d3.select(this).classed("selected_level_node", true);


  var level_num = d.level_num;

  switch (level_num) {
    case 'l0':
      level_0();
    break;
    case 'l1':
      level_1();
    break;
    case 'l2':
      level_2();
    break;
    case 'general':
      general_level();
    break;

  }

}

function sort_validations(){
         var tmp_question_id;
         var tmp_block_id;

         if(related_valid_answered_question.length!==0){
           related_valid_answered_question.splice(0,related_valid_answered_question.length);
         }
         if(related_invalid_answered_question.length!==0){
           related_invalid_answered_question.splice(0,related_invalid_answered_question.length);
         }
         if(related_maybeValid_answered_question.length!==0){
           related_maybeValid_answered_question.splice(0,related_maybeValid_answered_question.length);
         }



       for(var c in f_data.blocks){
          var current_block_status = ' ';

          for(var m in f_data.question_block_links){

            if(f_data.blocks[c].block_id == f_data.question_block_links[m].block_id){

              var related_qs = f_data.question_block_links[m].qs_id;

              for(var current_question in answers_object.answers){
                if( related_qs == answers_object.answers[current_question].question_id){
                  for(var q in f_data.questions){
                    if(f_data.questions[q].qs_id === answers_object.answers[current_question].question_id){
                      var qs_type = f_data.questions[q].qs_type;
                      var qs_validity;
                      qs_validity=
                        find_validity_for_each_question(f_data,f_data.blocks[c].block_id,
                        answers_object.answers[current_question].question_id,
                        answers_object.answers[current_question].answer, qs_type);
                    }}

                  tmp_question_id = answers_object.answers[current_question].question_id;
                  tmp_block_id = f_data.blocks[c].block_id;
                 // alert(qs_validity)
                //find related blocks here and add this answer to related blocks as well and check validation too
                //find_validity_for_each_question(f_data,block_id,answers_object.question_id, answers_object.answers[current_question].ans_object[s].answer);
                //or add it to answers object

                //  function assign_validation(qs_validity,tmp_block_id,tmp_question_id){
                //iterates over qs, shouldn't be that, should iterate over block_id
                switch (qs_validity) {

                  case 'valid':
                    related_valid_answered_question.push([tmp_block_id,tmp_question_id]);
                   // alert(tmp_block_id + "qs: " + tmp_question_id)
                    break;

                  case 'invalid':
                    related_invalid_answered_question.push([tmp_block_id,tmp_question_id]);
                   // alert(tmp_block_id + "qs: " + tmp_question_id)
                     break;

                  case 'maybe_valid':
                    related_maybeValid_answered_question.push([tmp_block_id,tmp_question_id]);
                    //alert(tmp_block_id + "qs: " + tmp_question_id)
                    break;

                }


                }
            }
            }
          }

        }

        related_valid_answered_questions();
        related_invalid_answered_questions();
        related_maybeValid_answered_questions();

       var valid_counts = []
       valid_counts = count_valid_answers(clicked_node, related_valid_answered_question);


       var invalid_counts = []
       invalid_counts = count_invalid_answers(clicked_node, related_invalid_answered_question);

      var maybevalid_counts= []
      maybevalid_counts = count_maybevalid_answers(clicked_node , related_maybeValid_answered_question);

       var related_questions = [];
       related_questions= find_related_questions(clicked_node);

       var qs_probability = answered_questions_probability(related_questions, valid_counts)




}

function count_valid_answers(block_id, related_valid_answered_question){
  var valid_anws = []
  for(var i in related_valid_answered_question){
    if(related_valid_answered_question[i][0] == block_id){
      valid_anws.push(related_valid_answered_question[i][1])
    }
  }
   return(valid_anws)
}


function count_invalid_answers(block_id, related_invalid_answered_question){
  var invalid_anws = []
  for(var i in related_invalid_answered_question){
    if(related_invalid_answered_question[i][0] == block_id){
      invalid_anws.push(related_invalid_answered_question[i][1])
    }
  }
  return(invalid_anws)
}


function count_maybevalid_answers(block_id, related_maybeValid_answered_question){
  var maybevalid_anws = []
  for(var i in related_maybeValid_answered_question){
    if(related_maybeValid_answered_question[i][0] == block_id){
      maybevalid_anws.push(related_maybeValid_answered_question[i][1])
    }
  }
  return(maybevalid_anws)
}


function answered_questions_probability(all_questions, answered_questions){

  var qs_probability = (answered_questions.length/all_questions.length)*100;
  qs_probability = Math.round(qs_probability);
  return(qs_probability)
}

var tmp_array = [];
var stored_questions =[];

function find_related_questions (d){
  var related_objs= [];
  var qsId;
  for(var m in f_data.question_block_links){
    if(d == f_data.question_block_links[m].block_id){
      qsId = f_data.question_block_links[m].qs_id;
      related_objs.push(qsId);
    }
  }
  return(related_objs);
}


// validation changes for extended nodes
function change_for_extended_nodes(question_id, change, qs_type){
 // svgContainer_rect.select("g.extended-level2").selectAll("g.node").each(function(d,i){
  svgContainer_rect.selectAll("g.node").each( function(d,i){
    d3.select(this).classed("related_nodes", false);
    d3.select(this).classed("related_valid_node", false);
    d3.select(this).classed("related_invalid_node", false);
    d3.select(this).classed("related_maybeValid_node", false);
  });
  svgContainer_rect.select("g.extended-level2").selectAll("g.node").each( function(d,i){
    d3.select(this).classed("related_nodes", false);
    d3.select(this).classed("related_valid_node", false);
    d3.select(this).classed("related_invalid_node", false);
    d3.select(this).classed("related_maybeValid_node", false);
  });
  svgContainer_rect.selectAll("g.node").each(function(d,i){

    if(document.getElementById(d.block_id).classList.contains('selected_node')){
      var parent_id = d.block_id;
      svgContainer_rect.select("g.extended-level2").selectAll("g.node").each(function(d,i){
        for(var a in f_data.answers_concept_definition){
          if(f_data.answers_concept_definition[a].qs_id === question_id){
            for(var b in f_data.answers_concept_definition[a].affected_dosage_blocks){
              if(f_data.answers_concept_definition[a].affected_dosage_blocks[b].block_id === parent_id){
                var dl = f_data.answers_concept_definition[a].affected_dosage_blocks[b].dl;
                if(d.id === parent_id+"_part_"+dl){
                  for(var c in f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers){
                    switch(qs_type){
                      case 'option':
                        if(change === f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers[c].value){
                          var validity = f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers[c].validity;
                          switch(validity){
                            case 'valid':
                              d3.select(this).classed("related_valid_node", true);
                              //alert("valid")
                            break;
                            case 'invalid':
                              d3.select(this).classed("related_invalid_node", true);
                              //alert("invalid")
                            break;
                            case 'maybe_valid':
                              d3.select(this).classed("related_maybeValid_node", true);
                              //alert("maybevalid")
                            break;
                          }
                          //alert(qs_type+ d.id + change + f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers[c].validity)
                      }
                      break;
                      case 'range':
                        var min= f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers[c].min;
                        var max= f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers[c].max;
                        if(+min< +change && +change < +max){
                          //alert(qs_type+"id: " +d.id + "----"+ change + f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers[c].validity)
                          var validity = f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers[c].validity;
                          switch(validity){
                            case 'valid':
                              d3.select(this).classed("related_valid_node"+parent_id, true);
                              //alert("valid")
                            break;
                            case 'invalid':
                              d3.select(this).classed("related_invalid_node"+parent_id, true);
                              //alert("invalid")
                            break;
                            case 'maybe_valid':
                              d3.select(this).classed("related_maybeValid_node"+parent_id, true);
                              //alert("maybevalid")
                            break;
                          }
                          //alert(qs_type+ d.id + change + f_data.answers_concept_definition[a].affected_dosage_blocks[b].possible_answers[c].validity)
                        }

                      break;
                    }
                }
              }
            }
          }
        }
      }
      })

     // d3.select(this).classed("related_valid_node", true);

    }
  } )
}


// validation changes for extended nodes


var flg = [];

function related_valid_answered_questions(){

  for(var b in block_validity.blocks){
    var related_questions = [];
    related_questions.push(block_validity.blocks[b].block_id,find_related_questions(block_validity.blocks[b].block_id));

            if(flg.length !== 0){
             flg.splice(0,flg.length);
           }
         for(var o in related_valid_answered_question){

            if( related_questions[0]== related_valid_answered_question[o][0]){
              for(var h in related_questions[1]){
                if(related_questions[1][h]== related_valid_answered_question[o][1]){

                    if(block_validity.blocks[b].block_validity === "no_way")
                     {
                       block_validity.blocks[b].block_validity = "temp_status";
                       block_validity.blocks[b].dosage = null;
                       highlight_dosage = null;

                      // valid_node();

                      }
                    else if(block_validity.blocks[b].block_validity === "maybe_ok")
                    {
                       block_validity.blocks[b].block_validity = "temp_status";
                       block_validity.blocks[b].dosage = null;
                       highlight_dosage = null;
                     // valid_node();

                    }


                  flg.push(related_questions[1][h]);

                  if(flg.length==related_questions[1].length){

                            block_validity.blocks[b].block_validity = "ok";
//find related questions, then each question's dosage then check if all of them have the same dosage then assign that dosage to block_validdity.blocks
                            block_validity.blocks[b].dosage = find_related_dosage(f_data,block_validity.blocks[b].block_id, related_valid_answered_question[o][1]);
                            //valid_node();

              }
            }
         }

      }
    }

  }

}
function related_invalid_answered_questions(){

  for(var b in block_validity.blocks){

      for(var n in related_invalid_answered_question){
            if(block_validity.blocks[b].block_id == related_invalid_answered_question[n][0]){
               block_validity.blocks[b].block_validity = "no_way";
               block_validity.blocks[b].dosage = null;
               highlight_dosage = null;

             //  valid_node();
            }
      }
  }


}

function related_maybeValid_answered_questions(){

  for(var b in block_validity.blocks){

      for(var n in related_maybeValid_answered_question){



          if(block_validity.blocks[b].block_id == related_maybeValid_answered_question[n][0])
          {
            block_validity.blocks[b].block_validity = "maybe_ok";
            block_validity.blocks[b].dosage = null;
            highlight_dosage = null;
           // valid_node();

           for(var a in related_invalid_answered_question){
            if(block_validity.blocks[b].block_id == related_invalid_answered_question[a][0])
               {
                 block_validity.blocks[b].block_validity = "no_way";
                 block_validity.blocks[b].dosage = null;
                 highlight_dosage = null;
                 //valid_node();

                }
             }

        }
      }
  }

}

var level_buttons_clicked;
function close_form()
  {
        if(typeof clicked_node !== "undefined"){

          level_buttons_clicked = undefined;

          switch (structure_mode) {
              case 'mode_1':
                draw_table(clicked_node);
                break;

              case 'mode_2':
                draw_table_multiple_selection(qs_numbers);
                //console.log(qs_numbers)
                break;

              default:
                draw_table_for_levels(level_buttons_clicked);
            }

            x.style.display = "none";
        }


        if(typeof level_buttons_clicked !== "undefined"){

           draw_table_for_levels(level_buttons_clicked);

        }

                 x.style.display = "none";

        svgContainer_rect.selectAll("g.node").each( function(d,i){
                   d3.select(this).classed("related_nodes", false);
                   d3.select(this).classed("related_valid_node", false);
                   d3.select(this).classed("related_invalid_node", false);
                   d3.select(this).classed("related_maybeValid_node", false);
                 });
    }

  if(document.getElementById("element")){
  var new_element = document.getElementById('element');
}


function add_row(event,d){

  var location = event.target;
  location.appendChild(new_element);

}

function add_row_element(location,d){
  location.appendChild(new_element);
}



function tabulate(data, columns) {
  const ids = data.map(d => d.qs_id)
  data = data.filter(({qs_id}, index) => !ids.includes(qs_id, index + 1))
  let iconClassMapping = {
    "valid": "fas fa-check-circle valid",
    "invalid": "fas fa-times-circle invalid",
    "maybe_valid": "fas fa-exclamation-circle maybe_valid",
    "unknown": "fas fa-exclamation-circle unknown"
  };

  let styleMapping = {
    "valid": "font-size: 16px;padding-top: 5px;color: #78bea0;",
    "invalid":   "font-size: 16px;padding-top: 5px;color: #fb8998;",
    "maybe_valid":  "font-size: 16px;padding-top: 5px;color: #ebbf6d;",
    "unknown":  "font-size: 16px;padding-top: 5px;color: #746D69;",
  };

  var table = d3.select('#table').attr("class", "table tableFixHead")

  table.select('thead').remove();
  table.select('tbody').remove();
  var thead = table.append('thead');
  var	tbody = table.append('tbody');
  // append the header row
  thead.append('tr')
    .selectAll('th')
    .data(columns).enter()
    .append('th')
    .attr("class", "text-center")
    .text(function (column) { return column; });

  // create a row for each object in the data
  var rows = tbody.selectAll('tr')
    .data(data)
    .enter()
    .append('tr')
    .attr("id", function (d) { return d.qs_id})
    .on("click", show_form);

  var cells = rows.selectAll('td')
    .data(function (row) {
      return columns.map(function (column) {
        return {column: column, value: row[column]};

      });
    })
    .enter()
    .append('td')
    .attr("class", function(d, i) {
      if(i === 0 ) {
        return "text-center question-level-cell"
      }
      if(i === 1) {
        return "text-center question-status-cell"
      }
      if(i === 2) {
        return "main-cell"
      }
      if(i == 3) {
        return "text-center table-action-mode"
      }
      if(i < 2) {
        return "text-center"
      }

      return ""
    })
    .text(function (d, i) {
      /*if(i === 1) {
        return ""
      } */
      return d.value;
    });

   $("td.text-center.question-level-cell").each(function(i, d) {
        var value = $(this).html()
        if(value.includes("informative")) {
            $(this).html("")
            var level = value.split(" ")[0].trim()
            let container = $('<div>', {

            })
            $(`<div>${level}</div>`).appendTo(container);
            $('<div><i class="fas fa-info"></i></div>').appendTo(container);
            $(this).append(container)
        }
   })



    $(".table-action-mode").each(function(d, i) {
      let container = $('<div>', {
        style: "display:flex; flex-direction:column; justify-content:center; gap:5px"
      })


      let $editBtn  = $('<div><i class="fas fa-edit", id= "editBtn"></i></div>').appendTo(container);
      let $deleteBtn = $('<div><i class="fas fa-trash", id= "delBtn"></i></div>').appendTo(container);

      if(isAuthenticated === false){
       // alert("hide bts")
       console.log("hide")
        $editBtn.hide();
        $deleteBtn.hide();
      }
      //when does this function activate?
      else if(isAuthenticated === true){
      // alert("show bts")
        console.log("show")
        $editBtn.show();
        $deleteBtn.show();
      }

      $editBtn.click( function (event) {
        event.stopPropagation()
        let questionId = $(this).closest('tr').attr("id")
        questionHandler.editQuestion(questionId)
        console.log("editBtn")
      })

      $deleteBtn.click( (event) => {
        event.stopPropagation()
        let questionId = $(this).closest('tr').attr("id")
        var choice = confirm("Are you sure to delete this question?");

        if (choice) {
          questionHandler.deleteQuestion(questionId)
          all();
          redrawGraph(f_data)
        }
      })

      $(this).append(container)
    })
    let questionStatusCells = d3.selectAll("td.text-center.question-status-cell")
    questionStatusCells.each(function(d) {

      let questionId = $(d3.select(this).node().parentNode).attr("id")
      let questionData = data.filter((d) => d.qs_id === questionId)
      if(questionData.length > 0) {
        if(questionData[0].type === null) {
          let statusList = questionData[0].Status
          for(let i=0; i < statusList.length; i++) {
              let status = statusList[i]
              d3.select(this)
                .append("i")
                .attr("class", iconClassMapping[status.validity])
                .attr("style", styleMapping[status.validity])
          }
        }
      }
    })

    return(table);
}


var selected_node;

function select_clusters(i,d){
  if(d == "level_0"){
    level_0();
  }
  else if(d == "level_1"){
    level_1();
  }
  else if(d == "level_2"){
    level_2();
  }
  else if(d == "general"){
    general_level();
  }
 /* else if(d == "dosage"){
    dosage();
  }*/

  else if(d == "main"){
    all();
  }
}

var red_class;
var green_class;
var orange_class;
var blue_class;
var parent_dosage_block;
var child_dosage_block;
var highlight_dosage;
var status_check = [];
var validation_status = [];
var previous_answers = [];

function get_previous_answers(){
  for(var ans in ans_data.answers){
       previous_answers.push(ans_data.answers[ans].question_id);
  }
  update_pre_status();
}

function update_pre_status(){

    for(var n in f_data.questions){
       for(var a in previous_answers){
         if(f_data.questions[n].qs_id ==previous_answers[a])
         {
           status_check[n]=["yes"];
           var levelNum= f_data.questions[n].level_number;
           if(levelNum === "l0" ){
             level_0();
           }
           else if(levelNum === "l1"){
             level_1();
           }
           else if(levelNum === "l2"){
             level_2();
           }
           else if(levelNum === "general"){
            general_level();
          }
           else if(levelNum === "dosage"){
             dosage();
           }

         }
       }
      }

}
function set_status1(question_id,status){
      var res = " ";
      //for(var n in f_data.questions){
       for(var i in answers_object.answers){
        if(answers_object.answers[i].question_id == question_id)
       {
         var res = status

        }


       }

       return(res);
      //}
 }

//sets color for the answered questions (valid/invalid/maybe_valid)
function set_color(question_id, block_id){
  var qs_color;
  for(var n in answers_object.answers){
    if(answers_object.answers[i].question_id === question_id){

    for(var r in f_data.answers_concept_definition)

       {
          if( f_data.answers_concept_definition[r].qs_id === question_id)
          {
            for(var b_id in f_data.answers_concept_definition[r].affected_dosage_blocks){
              if(f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].block_id ===block_id ){

              for(var p in f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers){

                if(f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity === "valid"){
                  qs_color = "green"

                }
                else if(f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity === "maybe_valid"){
                  qs_color = "orange"

                }
                else if(f_data.answers_concept_definition[r].affected_dosage_blocks[b_id].possible_answers[p].validity === "invalid"){
                  qs_color = "red"

                }
                return(qs_color)
              }
            }
          }
        }
      }
    }
  }
}


function find_answered_status(question_id){
  var answer_status;
  for(var t in answers_object.answers){
    if(answers_object.answers[t].question_id === question_id){
      if(answers_object.answers[t].answer === ""){
        answer_status = " "
      }
      else{
        answer_status = "yes"
      }
    }
  }
  return(answer_status)
}

function draw_table_for_levels(level_number){
  var lvl_questions = {
      questions:[]
  };
  let filterdQuestions = f_data.questions.filter((d)=> d.level_number.trim() != "" )
  if(level_number != "all") {
      if(level_number === "informative") {
        filterdQuestions = f_data.questions.filter((d)=> d.qs_feature === level_number)
      }
      else {
        filterdQuestions = f_data.questions.filter((d)=> d.level_number === level_number)
      }
  }
  lvl_questions = generateQuestionTableData(filterdQuestions, false, false)
  return(tabulate( lvl_questions.questions, ['Level','Answered','Question', "Action"]));

  for(var m in f_data.questions)

       {
         if(level_number === "l0" || level_number === "l1" || level_number === "l2" || level_number === "dosage" || level_number === "general"){
          if( f_data.questions[m].level_number == level_number)
          {
            var tmp_id = f_data.questions[m].qs_id;
            var level_n = f_data.questions[m].level_number;
            var tmp_level = find_level(level_n);
            var answered_status = find_answered_status(f_data.questions[m].qs_id)
            var statusInfo = getQuestionStatusInfo(tmp_id)
            var qs_feature = find_question_feature(tmp_id)
            var l;
            if(qs_feature === "informative"){
               l = tmp_level+"("+qs_feature+")"
            }
            else{
              l = tmp_level
            }
            lvl_questions.questions.push({
              "qs_id" : f_data.questions[m].qs_id,
              "Answered": set_status1(tmp_id,answered_status),
              "Status": statusInfo,
              "type":level_number,
              "Level" : l,
              "Question" : f_data.questions[m].question
            });

          }

         }
          else if(level_number === "all"){
            if(f_data.questions[m].level_number == "l0" || f_data.questions[m].level_number == "l1" || f_data.questions[m].level_number == "l2" || f_data.questions[m].level_number == "dosage"  || f_data.questions[m].level_number === "general"){

            var tmp_id2 = f_data.questions[m].qs_id;
            var level_n = f_data.questions[m].level_number;
            var tmp_level = find_level(level_n);
            var answered_status = find_answered_status(f_data.questions[m].qs_id)
            //alert(level_n);
            var statusInfo = getQuestionStatusInfo(tmp_id2)
            var qs_feature = find_question_feature(tmp_id2)
            var l;
            if(qs_feature === "informative"){
               l = tmp_level+"("+qs_feature+")"
            }
            else{
              l = tmp_level
            }

            lvl_questions.questions.push({
              "qs_id" : f_data.questions[m].qs_id,
              "Answered": set_status1(tmp_id2,answered_status),
              "Status": statusInfo,
              "type":level_number,
              "Level" : l,
              "Question" : f_data.questions[m].question
            });

            }

          }
          else if(level_number === "informative"){
            if(f_data.questions[m].qs_feature === "informative"){

            var tmp_id2 = f_data.questions[m].qs_id;
            var level_n = f_data.questions[m].level_number;
            var tmp_level = find_level(level_n);
            var answered_status = find_answered_status(f_data.questions[m].qs_id)
            //alert(level_n);
            var statusInfo = getQuestionStatusInfo(tmp_id2)
            var qs_feature = find_question_feature(tmp_id2)
            var l;
            if(qs_feature === "informative"){
               l = tmp_level+"("+qs_feature+")"
            }
            else{
              l = tmp_level
            }

            lvl_questions.questions.push({
              "qs_id" : f_data.questions[m].qs_id,
              "Answered": set_status1(tmp_id2,answered_status),
              "Status": statusInfo,
              "type":level_number,
              "Level" : l,
              "Question" : f_data.questions[m].question

            });

            }

          }

        }
  return(tabulate( lvl_questions.questions, ['Level','Answered','Question', "Action"]));

}

function all(){
  Shiny.setInputValue("block_name", "Select a block");
                  if(selected_edge.length !== 0){
                      for(var ed in selected_edge){
                               selected_edge[ed].classed("related_edges", false);
                               selected_edge[ed].classed("related_valid_edges", false);
                               selected_edge[ed].classed("related_invalid_edges", false);
                               selected_edge[ed].classed("related_maybeValid_edges", false);
                            }
                      selected_edge.splice(0,selected_edge.length);
                    }
                if(selected_edge1.length !== 0){
                      for(var ed1 in selected_edge1){
                               selected_edge1[ed1].classed("related_edges", false);
                               selected_edge1[ed1].classed("related_valid_edges", false);
                               selected_edge1[ed1].classed("related_invalid_edges", false);
                               selected_edge1[ed1].classed("related_maybeValid_edges", false);
                            }
                      selected_edge1.splice(0,selected_edge1.length);
                    }

      if(typeof selected_level_node !== "undefined"){
          selected_level_node.classed("selected_level_node", false);
      }
    if(typeof selected_node !== "undefined"){
      selected_node.classed("selected_node", false);
      block_info.style.display = "none";
             }
    clicked_node_block = undefined;
    clicked_node = undefined;
    selected_node = undefined;
  var level_number = "all";
  draw_table_for_levels(level_number);
  level_buttons_clicked = level_number;


}
function informative(){
  Shiny.setInputValue("block_name", "Select a block");
                  if(selected_edge.length !== 0){
                      for(var ed in selected_edge){
                               selected_edge[ed].classed("related_edges", false);
                               selected_edge[ed].classed("related_valid_edges", false);
                               selected_edge[ed].classed("related_invalid_edges", false);
                               selected_edge[ed].classed("related_maybeValid_edges", false);
                            }
                      selected_edge.splice(0,selected_edge.length);
                    }
                if(selected_edge1.length !== 0){
                      for(var ed1 in selected_edge1){
                               selected_edge1[ed1].classed("related_edges", false);
                               selected_edge1[ed1].classed("related_valid_edges", false);
                               selected_edge1[ed1].classed("related_invalid_edges", false);
                               selected_edge1[ed1].classed("related_maybeValid_edges", false);
                            }
                      selected_edge1.splice(0,selected_edge1.length);
                    }

      if(typeof selected_level_node !== "undefined"){
          selected_level_node.classed("selected_level_node", false);
      }
    if(typeof selected_node !== "undefined"){
      selected_node.classed("selected_node", false);
      block_info.style.display = "none";
             }
    clicked_node_block = undefined;
    clicked_node = undefined;
    selected_node = undefined;
  var level_number = "informative";
  draw_table_for_levels(level_number);
  level_buttons_clicked = level_number;
}

function level_0(){
  Shiny.setInputValue("block_name", "Select a block");


                svgContainer_rect.selectAll("g.node").each( function(d,i){
                  d3.select(this).classed("related_nodes", false);
                  d3.select(this).classed("related_valid_node", false);
                  d3.select(this).classed("related_invalid_node", false);
                  d3.select(this).classed("related_maybeValid_node", false);
                });
                if(selected_edge.length !== 0){
                      for(var ed in selected_edge){
                               selected_edge[ed].classed("related_edges", false);
                               selected_edge[ed].classed("related_valid_edges", false);
                               selected_edge[ed].classed("related_invalid_edges", false);
                               selected_edge[ed].classed("related_maybeValid_edges", false);
                            }
                      selected_edge.splice(0,selected_edge.length);
                    }
                if(selected_edge1.length !== 0){
                      for(var ed1 in selected_edge1){
                               selected_edge1[ed1].classed("related_edges", false);
                               selected_edge1[ed1].classed("related_valid_edges", false);
                               selected_edge1[ed1].classed("related_invalid_edges", false);
                               selected_edge1[ed1].classed("related_maybeValid_edges", false);
                            }
                      selected_edge1.splice(0,selected_edge1.length);
                    }

    if(typeof selected_node !== "undefined"){
      selected_node.classed("selected_node", false);
      block_info.style.display = "none";
             }
    clicked_node_block = undefined;
    clicked_node = undefined;
    selected_node = undefined;
  var level_number = "l0";
  draw_table_for_levels(level_number);
  level_buttons_clicked = level_number;


}
function level_1(){
  Shiny.setInputValue("block_name", "Select a block");

  svgContainer_rect.selectAll("g.node").each( function(d,i){
    d3.select(this).classed("related_nodes", false);
    d3.select(this).classed("related_valid_node", false);
    d3.select(this).classed("related_invalid_node", false);
    d3.select(this).classed("related_maybeValid_node", false);
  });
                  if(selected_edge.length !== 0){
                      for(var ed in selected_edge){
                               selected_edge[ed].classed("related_edges", false);
                               selected_edge[ed].classed("related_valid_edges", false);
                               selected_edge[ed].classed("related_invalid_edges", false);
                               selected_edge[ed].classed("related_maybeValid_edges", false);
                            }
                      selected_edge.splice(0,selected_edge.length);
                    }
                if(selected_edge1.length !== 0){
                      for(var ed1 in selected_edge1){
                               selected_edge1[ed1].classed("related_edges", false);
                               selected_edge1[ed1].classed("related_valid_edges", false);
                               selected_edge1[ed1].classed("related_invalid_edges", false);
                               selected_edge1[ed1].classed("related_maybeValid_edges", false);
                            }
                      selected_edge1.splice(0,selected_edge1.length);
                    }

    if(typeof selected_node !== "undefined"){
      selected_node.classed("selected_node", false);
      block_info.style.display = "none";
             }
    clicked_node_block = undefined;
    clicked_node = undefined;
    selected_node = undefined;
  var level_number = "l1";
  draw_table_for_levels(level_number);
  level_buttons_clicked = level_number;


}
function level_2(){
  Shiny.setInputValue("block_name", "Select a block");

  svgContainer_rect.selectAll("g.node").each( function(d,i){
    d3.select(this).classed("related_nodes", false);
    d3.select(this).classed("related_valid_node", false);
    d3.select(this).classed("related_invalid_node", false);
    d3.select(this).classed("related_maybeValid_node", false);
  });
                  if(selected_edge.length !== 0){
                      for(var ed in selected_edge){
                               selected_edge[ed].classed("related_edges", false);
                               selected_edge[ed].classed("related_valid_edges", false);
                               selected_edge[ed].classed("related_invalid_edges", false);
                               selected_edge[ed].classed("related_maybeValid_edges", false);
                            }
                      selected_edge.splice(0,selected_edge.length);
                    }
                if(selected_edge1.length !== 0){
                      for(var ed1 in selected_edge1){
                               selected_edge1[ed1].classed("related_edges", false);
                               selected_edge1[ed1].classed("related_valid_edges", false);
                               selected_edge1[ed1].classed("related_invalid_edges", false);
                               selected_edge1[ed1].classed("related_maybeValid_edges", false);
                            }
                      selected_edge1.splice(0,selected_edge1.length);
                    }

    if(typeof selected_node !== "undefined"){
      selected_node.classed("selected_node", false);
      block_info.style.display = "none";
             }
    clicked_node_block = undefined;
    clicked_node = undefined;
    selected_node = undefined;
  var level_number = "l2";
  draw_table_for_levels(level_number);
  level_buttons_clicked = level_number;


}
function dosage(){
  Shiny.setInputValue("block_name", "Select a block");
                  if(selected_edge.length !== 0){
                      for(var ed in selected_edge){
                               selected_edge[ed].classed("related_edges", false);
                               selected_edge[ed].classed("related_valid_edges", false);
                               selected_edge[ed].classed("related_invalid_edges", false);
                               selected_edge[ed].classed("related_maybeValid_edges", false);
                            }
                      selected_edge.splice(0,selected_edge.length);
                    }
                if(selected_edge1.length !== 0){
                      for(var ed1 in selected_edge1){
                               selected_edge1[ed1].classed("related_edges", false);
                               selected_edge1[ed1].classed("related_valid_edges", false);
                               selected_edge1[ed1].classed("related_invalid_edges", false);
                               selected_edge1[ed1].classed("related_maybeValid_edges", false);
                            }
                      selected_edge1.splice(0,selected_edge1.length);
                    }

    if(typeof selected_node !== "undefined"){
      selected_node.classed("selected_node", false);
      block_info.style.display = "none";
             }
    clicked_node_block = undefined;
    clicked_node = undefined;
    selected_node = undefined;
  var level_number = "dosage";
  draw_table_for_levels(level_number);
  level_buttons_clicked = level_number;


}
function general_level(){
  Shiny.setInputValue("block_name", "Select a block");

  svgContainer_rect.selectAll("g.node").each( function(d,i){
    d3.select(this).classed("related_nodes", false);
    d3.select(this).classed("related_valid_node", false);
    d3.select(this).classed("related_invalid_node", false);
    d3.select(this).classed("related_maybeValid_node", false);
  });
                  if(selected_edge.length !== 0){
                      for(var ed in selected_edge){
                               selected_edge[ed].classed("related_edges", false);
                               selected_edge[ed].classed("related_valid_edges", false);
                               selected_edge[ed].classed("related_invalid_edges", false);
                               selected_edge[ed].classed("related_maybeValid_edges", false);
                            }
                      selected_edge.splice(0,selected_edge.length);
                    }
                if(selected_edge1.length !== 0){
                      for(var ed1 in selected_edge1){
                               selected_edge1[ed1].classed("related_edges", false);
                               selected_edge1[ed1].classed("related_valid_edges", false);
                               selected_edge1[ed1].classed("related_invalid_edges", false);
                               selected_edge1[ed1].classed("related_maybeValid_edges", false);
                            }
                      selected_edge1.splice(0,selected_edge1.length);
                    }

    if(typeof selected_node !== "undefined"){
      selected_node.classed("selected_node", false);
      block_info.style.display = "none";
             }
    clicked_node_block = undefined;
    clicked_node = undefined;
    selected_node = undefined;
  var level_number = "general";
  draw_table_for_levels(level_number);
  level_buttons_clicked = level_number;
}

var selected_id;
var clicked_node_block;
var clicked_array_block = [];
var clicked_node;
var selection_validity;
var selected_edge = [];
var selected_edge1 = [];
var keep_selection_class;
var keep_i;
var keep_d;
var qs_numbers = [];
var temp_block_clicked;

function showQuestion(i, d){

    keep_i = i;
    keep_d = d.block_id;
    active_block = d.block_id;
    blockHandler.setSelectedBlock(active_block);
    block = find_current_validation(active_block)
    x.style.display = "none";
   clicked_node_block= d.block_id;

    //Shiny.onInputChange("change_qs_type", "");

   //alert(clicked_node_block);
  if(typeof selected_level_node !== "undefined"){
        selected_level_node.classed("selected_level_node", false);
    }
   if(typeof selected_node !== "undefined"){
     selected_node.classed("selected_node", false);

   }
   selected_node = d3.select(this);

   selected_node.classed("selected_node", true);
   $("#modification").removeAttr("disabled");
   //$("#modification").removeAttr("title");
   document.getElementById("modification").setAttribute("title", "Block details");



    if(typeof clicked_node_block !== "undefined"){
             for(var fb in f_data.blocks){
                         if(f_data.blocks[fb].block_id == clicked_node_block){
                           var related_node_name = f_data.blocks[fb].block_name;
                           Shiny.setInputValue("block_name", related_node_name);
                           temp_block_clicked = f_data.blocks[fb].block_name;
                          }
                         }
     }
     svgContainer_rect.select("g.extended-level2").selectAll("g.node").each( function(d,i){
      d3.select(this).classed("related_nodes", false);
      d3.select(this).classed("related_valid_node", false);
      d3.select(this).classed("related_invalid_node", false);
      d3.select(this).classed("related_maybeValid_node", false);
    });


   showEdges();

   if(selected_node_tb.length !== 0){
    for(var dtn in selected_node_tb){

             selected_node_tb[dtn].classed("related_nodes", false);

          }
    selected_node_tb.splice(0,selected_node_tb.length);
  }

  if(selected_valid_node_tb.length !== 0){
    for(var dtn in selected_valid_node_tb){

             selected_valid_node_tb[dtn].classed("related_valid_node", false);


          }
    selected_valid_node_tb.splice(0,selected_valid_node_tb.length);
  }

  if(selected_invalid_node_tb.length !== 0){
    for(var dtn in selected_invalid_node_tb){

             selected_invalid_node_tb[dtn].classed("related_invalid_node", false);

          }
    selected_invalid_node_tb.splice(0,selected_invalid_node_tb.length);
  }

  if(selected_maybeValid_node_tb.length !== 0){
    for(var dtn in selected_maybeValid_node_tb){

             selected_maybeValid_node_tb[dtn].classed("related_maybeValid_node", false);

          }
    selected_maybeValid_node_tb.splice(0,selected_maybeValid_node_tb.length);
  }

      var block_status;
                    /////
      if(structure_mode === "mode_2"){

        if( d3.select(this).classed('multiple_selection'))
          {
            d3.select(this).classed("multiple_selection",false);
            block_status = "inactive";
            // check if it exists in qs_numbers, then delete it from the array
            for(var i = 0 ; i< qs_numbers.length ; i++){
              if(qs_numbers[i] == clicked_node_block){
                console.log(" block "+ qs_numbers[i] + " got deactivated");
                qs_numbers.splice(i, 1);

          }
        }
      }

      else{

        d3.select(this).classed("multiple_selection",true);
        block_status = "active";
        qs_numbers.push(clicked_node_block);
        //check if block class is multiple_selection then add it to the qs_numbers (if it didn't exist)
      }

        save_clicks(d.block_id,block_status);

       /* for(var i in qs_numbers){
          console.log("active blocks: "+qs_numbers);
        }*/

      draw_table_multiple_selection(qs_numbers)

      }
      else{
        block_status = "active";
        save_clicks(d.block_id,block_status);
        draw_table(clicked_node_block);
      }

           return
  }

/*if(document.getElementById("save_block_info")){
  document.getElementById("save_block_info").onclick = function (){save_block_info()};
}*/


if(document.getElementById("save_block_info")){
  document.getElementById("save_block_info").onclick = function (){save_block_info()};
}
function save_block_info(){
  var find_block_id;
 //alert(clicked_node_block)
  get_block_name = temp_block_clicked;
  get_block_validation = document.getElementById("block_validity").value ;
  get_block_comment = document.getElementById("caption").value ;
  var apply_saved = document.getElementById("save_block_info");
  apply_saved.style.color = "green";
  var current = new Date();
  var date = current.getDate();
  var hour = current.getHours();
  var min = current.getMinutes();
  var sec = current.getSeconds();
  var get_date = Date();
  var bl_flag;

  if(typeof(answers_object["blockAnswers"]) === "undefined") {

    answers_object["blockAnswers"] = {}

}

  /*for(var k in f_data.blocks){
    if(f_data.blocks[k].block_name === get_block_name){
      find_block_id = f_data.blocks[k].block_id;

    }
  }*/
  answers_object["blockAnswers"][clicked_node_block] = {
    "block_name" : get_block_name,
    "validation":get_block_validation,
    "comment" : get_block_comment,
    "timestamp" : get_date
  }

  /*blocks_object.blocks.push({
                  "block_name" : get_block_name,
                  "validation":get_block_validation,
                  "comment" : get_block_comment,
                  "timestamp" : get_date
  });

  //console.log(blocks_object.blocks)
  var send_blocks_object = JSON.stringify(blocks_object);
  Shiny.setInputValue("send_blocks_object", send_blocks_object);*/

  var send_json = JSON.stringify(answers_object)
  Shiny.setInputValue("send_json", send_json);

  block_info.style.display = "none";
  manual_validation(clicked_node_block, get_block_validation);
  /*blocks_object.blocks.forEach(d) => {
    valid_node2(clicked_node, d.question_id, d.answer, d.qs_type, d.qs_feature)
  }*/
  //valid_node2(find_block_id)

}
if(document.getElementById("close_block_info")){
  document.getElementById("close_block_info").onclick = function (){close_block_info()};
}
function close_block_info(){
  block_info.style.display = "none";

}
var manual_valid_node = [];
var manual_invalid_node = [];
var manual_maybe_valid_node = [];


function manual_validation(block, validation){
  console.log(block+ "  " + validation);

  svgContainer_rect.selectAll("g.node").each( function(d,i){
    if(d.block_id == block){

      switch (validation) {
        case 'Valid':
          console.log(validation)
          d3.select(this).classed("valid_node", false);
          d3.select(this).classed("maybeValid_node", false);
          d3.select(this).classed("invalid_node", false);
          d3.select(this).classed("manual_invalid_node", false);
          d3.select(this).classed("manual_maybeValid_node", false);
          d3.select(this).classed("manual_valid_node", true);
          manual_valid_node.push(d3.select(this));
          break;

        case 'Invalid':
          console.log(validation)
          d3.select(this).classed("valid_node", false);
          d3.select(this).classed("maybeValid_node", false);
          d3.select(this).classed("invalid_node", false);
          d3.select(this).classed("manual_valid_node", false);
          d3.select(this).classed("manual_maybeValid_node", false);
          d3.select(this).classed("manual_invalid_node", true);
          manual_invalid_node.push(d3.select(this));
          break;

        case 'Maybe Valid':
          console.log(validation)
          d3.select(this).classed("valid_node", false);
          d3.select(this).classed("maybeValid_node", false);
          d3.select(this).classed("invalid_node", false);
          d3.select(this).classed("manual_invalid_node", false);
          d3.select(this).classed("manual_valid_node", false);
          d3.select(this).classed("manual_maybeValid_node", true);
          manual_maybe_valid_node.push(d3.select(this));
          break;

        //default:
          // code
      }
    }
  });

}


function find_level(level_id){
  var level_name;
  if(level_id === "l0"){
    level_name = "0";
  }
  else if(level_id === "l1"){
    level_name = "1";
  }
  else if(level_id === "l2"){
    level_name = "2";
  }
  else if(level_id === "l3"){
    level_name = "l3";
  }
  else if(level_id === "dosage"){
    level_name = "dosage";
  }
  return(level_name);
}

function generateQuestionTableData(questionList, typeColIsNull = true, answeredColIsEmpty = false) {
    var lvl_questions = {
      questions:[]
    };
    for(let questionData of questionList) {
        let questionId = questionData.qs_id;
        var tmp_level = find_level(questionData.level_number);
        var answered_status = find_answered_status(questionId)
        var statusInfo = getQuestionStatusInfo(questionId)
        var qs_feature = questionData.qs_feature;
        lvl_questions.questions.push({
          "qs_id" : questionId,
          "Answered": answeredColIsEmpty ? "": set_status1(questionId,answered_status) ,
          "Status": statusInfo,
          "type": typeColIsNull ? null : questionData.level_number ,
          "Level" :  qs_feature === "informative" ? `${tmp_level} (${qs_feature})` : tmp_level,
          "Question" : questionData.question,
          "informative": qs_feature === "informative" ? true : false
        });
    }
    return lvl_questions;
}

function getQuestionStatusInfo(questionId) {
  var filteredAnswers = answers_object.answers.filter(d=> d.question_id ==questionId)
  var statusInfoList = []
  if(filteredAnswers.length > 0) {
    for(let index=0; index < filteredAnswers[0].block_id.length; index++) {
      if(filteredAnswers[0].block_id[index] === active_block) {
        let validity = filteredAnswers[0].block_validity[index]
        statusInfoList.push({
          validity: validity,
          activeBlock: active_block
        })
      }
    }
  }
  return statusInfoList;
}

function draw_table(d){
  draw_table_multiple_selection([d], true)
  return;
  for(var m in f_data.question_block_links)
     {
        if( d == f_data.question_block_links[m].block_id)
        {
          temp_id = f_data.question_block_links[m].qs_id;
          var level_n = f_data.questions[temp_id].level_number;
          var tmp_level = find_level(level_n);
          var answered_status = find_answered_status(f_data.questions[temp_id].qs_id)
          var statusInfo = getQuestionStatusInfo(temp_id)
          var qs_feature = find_question_feature(temp_id)
          var l;
          if(qs_feature === "informative"){
             l = tmp_level+"("+qs_feature+")"
          }
          else{
            l = tmp_level
          }

          questions_obj.questions.push({
            "qs_id" : f_data.questions[temp_id].qs_id,
           // "qs_color": set_color(temp_id, d),
            "Answered" : "",
            "Status": statusInfo,
            "type": null,
            "Level" : l,
            "Question" : f_data.questions[temp_id].question
          });

        }

      }

      return(tabulate( questions_obj.questions, ['Level','Answered','Question', 'Action']));

}


function draw_table_multiple_selection(qs_numbers, answeredColIsEmpty=false){
  var lvl_questions = {
    questions:[]
  };
  let blockIdList = qs_numbers
  let questionIdList = f_data.question_block_links.filter((d) => blockIdList.includes(parseInt(d.block_id))).map((d) => parseInt(d.qs_id))
  let filterdQuestions = f_data.questions.filter((d)=> questionIdList.includes(parseInt(d.qs_id)))
  lvl_questions = generateQuestionTableData(filterdQuestions, true, answeredColIsEmpty)
  return(tabulate( lvl_questions.questions, ['Level','Answered','Question', "Action"]));
var ok = null;
  var questions_obj = {
                        questions:[]
                      };
  for(var i in qs_numbers){
      for(var m in f_data.question_block_links)
     {
        if( qs_numbers[i] == f_data.question_block_links[m].block_id)
        {
          temp_id = f_data.question_block_links[m].qs_id;
          var level_n = f_data.questions[temp_id].level_number;
          var tmp_level = find_level(level_n);
          var answered_status = find_answered_status(f_data.questions[temp_id].qs_id)
          var statusInfo = getQuestionStatusInfo(temp_id)
          var qs_feature = find_question_feature(temp_id)
          var l;
          if(qs_feature === "informative"){
             l = tmp_level+"("+qs_feature+")"
          }
          else{
            l = tmp_level
          }

         questions_obj.questions.push({
            "qs_id" : f_data.questions[temp_id].qs_id,
            "Answered" : set_status1(temp_id,answered_status),
            "Status": statusInfo,
            "type": null,
            "Level" : l,
            "Question" : f_data.questions[temp_id].question
         });

        }

      }

  }

      return(tabulate( questions_obj.questions, ['Level','Answered','Question', 'Action']));

}


var final_valid_edges = []
var final_maybeValid_edges = []
function showEdges(){
                if(selected_edge.length !== 0){
                      for(var ed in selected_edge){
                               selected_edge[ed].classed("related_edges", false);
                               selected_edge[ed].classed("related_valid_edges", false);
                               selected_edge[ed].classed("related_invalid_edges", false);
                               selected_edge[ed].classed("related_maybeValid_edges", false);
                            }
                      selected_edge.splice(0,selected_edge.length);
                    }
                if(selected_edge1.length !== 0){
                      for(var ed1 in selected_edge1){
                               selected_edge1[ed1].classed("related_edges", false);
                               selected_edge1[ed1].classed("related_valid_edges", false);
                               selected_edge1[ed1].classed("related_invalid_edges", false);
                               selected_edge1[ed1].classed("related_maybeValid_edges", false);
                            }
                      selected_edge1.splice(0,selected_edge1.length);
                    }

                 var highlight_edges  = svgContainer_rect.selectAll("g.edgePath").each( function(d,i){
                        if(d.parent_id == clicked_node_block){
                                   selected_edge.push(d3.select(this));
                                   d3.select(this).classed("related_edges", true);


                          for(var j in block_validity.blocks){
                            if(d.parent_id == block_validity.blocks[j].block_id){
                              if(block_validity.blocks[j].block_validity == 'no_way'){
                                selected_edge.push(d3.select(this));
                               // d3.select(this).classed("related_invalid_edges", true);

                            }
                              if(block_validity.blocks[j].block_validity == 'maybe_ok'){
                                selected_edge.push(d3.select(this));
                                d3.select(this).classed("related_maybeValid_edges", true);
                            }
                          }
                            if(d.parent_id == block_validity.blocks[j].block_id){
                              if(block_validity.blocks[j].block_validity == 'ok'){
                                selected_edge.push(d3.select(this));
                                d3.select(this).classed("related_valid_edges", true);
                               if(d.child_id == highlight_dosage){
                                    selected_edge.push(d3.select(this));
                                    d3.select(this).classed("related_valid_edges", true);
                              }
                            }
                          }
                            if(d.parent_id == block_validity.blocks[j].block_id){
                              if(block_validity.blocks[j].block_validity == 'maybe_ok'){
                                selected_edge.push(d3.select(this));
                                d3.select(this).classed("related_maybeValid_edges", true);
                            }
                          }
                        }



                        }
                        if(d.child_id == clicked_node_block){
                                   selected_edge1.push(d3.select(this));
                                   d3.select(this).classed("related_edges", true);}

                          for(var j in block_validity.blocks){
                            if(d.child_id == block_validity.blocks[j].block_id){
                              if(block_validity.blocks[j].block_validity == 'ok'){
                                for(var t in block_validity.blocks){
                                  if(d.parent_id == block_validity.blocks[t].block_id){
                                    if(block_validity.blocks[t].block_validity == 'ok'){
                                        selected_edge1.push(d3.select(this));
                                        d3.select(this).classed("related_valid_edges", true);
                                        show_final_edges();
                                    }
                                  }
                                }

                            }
                          }

                            if(d.child_id == block_validity.blocks[j].block_id){
                              if(block_validity.blocks[j].block_validity == 'maybe_ok'){
                                for(var t in block_validity.blocks){
                                  if(d.parent_id == block_validity.blocks[t].block_id){
                                    if(block_validity.blocks[t].block_validity == 'ok'){
                                      selected_edge1.push(d3.select(this));
                                      d3.select(this).classed("related_maybeValid_edges", true);
                                    }
                                  }
                                }
                            }
                          }

                            if(d.child_id == block_validity.blocks[j].block_id){
                              if(block_validity.blocks[j].block_validity == 'ok'){
                                for(var t in block_validity.blocks){
                                  if(d.parent_id == block_validity.blocks[t].block_id){
                                    if(block_validity.blocks[t].block_validity == 'maybe_ok'){
                                      selected_edge1.push(d3.select(this));
                                      d3.select(this).classed("related_maybeValid_edges", true);
                                    }
                                  }
                                }
                            }
                          }
                        }
                     });


}

function show_final_edges(){

    if(final_valid_edges.length !== 0){
      for(var t in final_valid_edges){
        final_valid_edges[t].classed("related_final_valid_edges", false);
      }

    }

    if(final_maybeValid_edges.length !== 0){
      for(var t in final_maybeValid_edges){
        final_maybeValid_edges[t].classed("related_final_maybeValid_edges", false);
      }

    }

    var highlight_final_edges  = svgContainer_rect.selectAll("g.edgePath").each( function(d,i){


                          for(var j in block_validity.blocks){
                            if(d.child_id == block_validity.blocks[j].block_id){
                              if(block_validity.blocks[j].block_validity == 'ok'){
                                for(var t in block_validity.blocks){
                                  if(d.parent_id == block_validity.blocks[t].block_id && block_validity.blocks[t].block_validity == 'ok' ){
                                        d3.select(this).classed("related_final_valid_edges", true);
                                        final_valid_edges.push(d3.select(this));
                                  }
                                }

                            }
                          }

//check

                            if(d.child_id == block_validity.blocks[j].block_id){
                              if(block_validity.blocks[j].block_validity == 'maybe_ok'){
                                //alert(d.child_id)
                                for(var t in block_validity.blocks){
                                  if(d.parent_id == block_validity.blocks[t].block_id && block_validity.blocks[t].block_validity == 'maybe_ok' ){
                                        d3.select(this).classed("related_final_maybeValid_edges", true);
                                        final_maybeValid_edges.push(d3.select(this));
                                  }
                                }

                            }
                          }



                           if(d.parent_id == block_validity.blocks[j].block_id && block_validity.blocks[j].block_validity == 'ok'){
                                 for(var t in block_validity.blocks){
                                   if(d.child_id ==  block_validity.blocks[t].block_id && block_validity.blocks[t].block_id == highlight_dosage){
                                          d3.select(this).classed("related_final_valid_edges", true);
                                          final_valid_edges.push(d3.select(this));
                              }
                            }
                          }
                        }

                      });

}

function updateDosageBlocksFromFinalEdges() {
  svgContainer_rect.selectAll("g.node").each(function(d) {
    if (d.level !== "dosage" && d.level_number !== "dosage") return;

    let incomingEdges = f_data.edges.filter(edge => parseInt(edge.child) === parseInt(d.block_id));

    let hasValidPath = false;
    let hasMaybePath = false;

    incomingEdges.forEach(edge => {
      let edgeElem = document.getElementById(edge.edge_id);
      if (!edgeElem) return;

      if (edgeElem.classList.contains("related_final_valid_edges") ||
          edgeElem.classList.contains("related_valid_edges")) {
        hasValidPath = true;
      } else if (edgeElem.classList.contains("related_maybeValid_edges")) {
        hasMaybePath = true;
      }
    });

    d3.select(this).classed("valid_node", false);
    d3.select(this).classed("invalid_node", false);
    d3.select(this).classed("maybeValid_node", false);

    if (hasValidPath) {
      d3.select(this).classed("valid_node", true);
    } else if (hasMaybePath) {
      d3.select(this).classed("maybeValid_node", true);
    } else {
      d3.select(this).classed("invalid_node", true);
    }
  });
}

// -----------------block---------------------

function handleMouseOver(d, i) { d3.select(this)
                                  .transition()
                                  .duration('50')
                                  .attr('opacity', '.70')
                                  .attr("height", 55)
                                  .attr("fill","yellow")
                                  .text(function(d) {
                                    return d.block_name;
                                  });


                                }
function handleMouseOut(d, i) { d3.select(this).transition()
                                   .duration('50')
                                   .attr('opacity', '1')
                                   .attr("fill","gray")
                                   .attr("height", 50);
                              }

function change_class(id){
 document.getElementById(id).classList.toggle('active_mode');
}

function block_position(level_number, block_count){
  var neighbors;
  var x_loc, y_loc, width, height;

  for (var i in f_data.levels){
    if(f_data.levels[i].level_number === level_number){
      neighbors = f_data.levels[i].children_count;
    }
    else{
    neighbors = 0;
    }
  }

  //alert(neighbors);
  return [x_loc, y_loc, width, height]
}

function verify_parent_positions(current_block_id){

    var parent_id = null;
    var parent_x = null;
    var parent_width = null;
    var parent_y = null;
    var parent_height = null;

          for(var j in f_data.edges){

          if(current_block_id == f_data.edges[j].child){
             parent_id = f_data.edges[j].parent;

            for(var n in f_data.blocks){
              if(f_data.blocks[n].block_id == parent_id){
                parent_x = f_data.blocks[n].x;
                parent_y = f_data.blocks[n].y;
                parent_width = f_data.blocks[n].width;
                parent_height = f_data.blocks[n].height;
              }
            }
          }
        }

  return[parent_id,parent_x,parent_width, parent_y, parent_height];
}

function find_children(block_id){
  var children = [];
  for(var i in f_data.edges){
    if(f_data.edges[i].parent == block_id){
      children.push(f_data.edges[i].child);
    }
  }
  return(children)
}

function verify_child_positions(child_id){

    var child_x = null;
    var child_width = null;
    var child_y = null;
    var child_height = null;

          for(var j in f_data.edges){
            for(var n in f_data.blocks){
              if(f_data.blocks[n].block_id == child_id){
                child_x = f_data.blocks[n].x;
                child_y = f_data.blocks[n].y;
                child_width = f_data.blocks[n].width;
                child_height = f_data.blocks[n].height;
              }
            }
        }
  return[child_id,child_x,child_width, child_y, child_height];
}

function set_edges_loc(parent_x, parent_y, parent_width, parent_height, child_x, child_y, child_width, child_height){

  var parent_x_loc = parent_x + parent_width/2;
  var parent_y_loc = parent_y + parent_height;
  var child_x_loc = child_x + child_width/2;
  var child_y_loc = child_y ;

  return[parent_x_loc, parent_y_loc, child_x_loc, child_y_loc];
}


var rectData = []
var levelData = [];
var lines = []


var svgWidth = 1220;
var svgHeight = 735;

var l1_a_number =1;
var l1_b_number = 10;
var l1_c_number = 12;
var numberOfLevels = 4;
var a_width_counter = 0;
var b_width_counter = 0;
var c_width_counter = 0;

var block_width;
var block_height;
var block_color;
var parent_id = null;
var parent_x = null;
var parent_y = null;
var parent_width = null;
var parent_height = null;
var child_id = null;
var child_x = null;
var child_width = null;
var child_y = null;
var child_height = null;
var parent_x_loc;
var parent_y_loc;
var child_x_loc;
var child_y_loc;
var weight;


function redrawGraph(f_data) {
  var rectData = []
  var levelData = [];
  var lines = []
  var class_mode;
  rectData= node_production(f_data, rectData);
  levelData= level_production(f_data, levelData);
  lines= addEdge(f_data, lines, rectData)
  redraw_nodes(class_mode, rectData, levelData, lines)
  //answers_object.uploads[uploads_info.blockName] = uploads_info.fileList
  answers_object.answers.forEach((d) => {
    var qs_type = find_question_type (d.question_id)
    var qs_feature = find_question_feature(d.question_id)
    valid_node2('', d.question_id, d.answer, qs_type, qs_feature)
  })
  for(var blockId in answers_object["blockAnswers"]) {
    let blockAnswerObj = answers_object["blockAnswers"][blockId]
    console.log(blockAnswerObj.block_name)
    console.log(blockAnswerObj.validation)
   // Shiny.setInputValue("manual_block",blockAnswerObj.block_name)
    manual_validation(blockId, blockAnswerObj.validation);
  }

  //should push manual valid uploaded ones too
 /* like this:
  Shiny.addCustomMessageHandler('documentUploadUpdate', function(info) {
    $(".input-group > input[type='text']").val();
    $("#attach_progress").css('visibility', 'hidden');
  });*/
}



function node_production(f_data, rectData){
  if(f_data){
      var nd = [];
      for(var i in f_data.blocks)
    {
      var active = true;

      nd = addNode(f_data.blocks[i].level_number, f_data.blocks[i].block_id);
      rectData.push({
        "active" : active,
        "x": nd[0], "y": nd[1],
        "width": nd[2],
        "height":nd[3] ,
        "color" : f_data.blocks[i].color,
        "block_id": nd[6],
        "block_name": nd[4],
        "class": nd[5],
        "isChildNode" : false,
        "level": f_data.blocks[i].level_number,
      });
    }

  }
  return rectData
}


//node_production();


function node_filter(block_id){
  for(var t in rectData){
      if(rectData[t].block_id == block_id){
        rectData[t].active = false;
      }
    }
    var children = [];
    children =(find_children(block_id));

    if(children.length !== 0 ){

        node_activation(block_id, children)

    }


}



function node_activation(block_id, child_id){
  for(var s in child_id){
    var current_child = child_id[s];

    for(var i in rectData){
      if(rectData[i].block_id == block_id){
        block_active = rectData[i].active;

        if(block_active === false){
          //find the parent
          for(var j in rectData){
            if(rectData[j].block_id == current_child){
              rectData[j].active = false;
            }
          }
        }
      }
    }
  }
}

// this function receives number of a level and returns the block counts withis this level
function find_numberOfBlocks(level_number){
  var numberOfBlocks = 0;
  for(var i in f_data.blocks){
    if(f_data.blocks[i].level_number === level_number){
      numberOfBlocks += 1;

    }
  }
  return numberOfBlocks;
}

// add a new node to a level (block_id, block_name and class is required, either as an input or reading from json)
function addNode(level_number, block_id){
  var block_id, x0, x, y0, y, width, height, level_number, block_name, block_class, color, numberOfBlocks, position;
  level_number = level_number;
  block_id = block_id;
  numberOfBlocks = find_numberOfBlocks(level_number);
  position = 0;
  x0 = 50;
  y0 = 20;
  var margin = 5;
  svgWidth = $("#block_1").width()-20;
  for(var i in f_data.blocks){

    if(f_data.blocks[i].block_id === block_id){
      block_name = f_data.blocks[i].block_name;
      block_class = f_data.blocks[i].class //.block_class;
      position = f_data.blocks[i].position;
      color = f_data.blocks[i].color;

      //find positions
      width = svgWidth/numberOfBlocks - (x0/numberOfBlocks); // - 20px
      height = svgHeight/f_data.levels.length - (2*y0); // - 20;
      x = x0+ position*width - width;
      y = y0+ generate_y_levels(level_number);
      return[x, y, width-margin, height, block_name, block_class, block_id]
    }

  }

}

// to assign the data to hierarchical level nodes to make it available for the app to draw them
function generate_y_levels(level_number){
  var y;
  for(i in f_data.levels){
    if(f_data.levels[i].level_number === level_number){
      y = (f_data.levels[i].id-1) * svgHeight/f_data.levels.length;
    }
  }
  return y
}

function levelData_info(level_number){

  var x, y, height, width, block_id, block_name, level_class, level_num, color, font_color, numberOfLevels;
  block_id = level_number;
  level_num = level_number;

  for(var i in f_data.levels){
    numberOfLevels = f_data.levels.length;
    if(f_data.levels[i].level_number === level_number){
      x = 0;
     // y = i*svgHeight/numberOfLevels;
      y = generate_y_levels(level_num)
      height = svgHeight/numberOfLevels;
      width = svgWidth;
      block_name = f_data.levels[i].block_name;
      level_class =f_data.levels[i].level_class;

      switch (level_number) {
        case 'l0':
          color = "#eae7dc";
          font_color = "#999191";
          break;
        case 'l1':
          color = "#d8c3a5";
          font_color = "white";
          break
        case 'l2':
          color = "#8e8d8a";
          font_color = "white";
          break
        case 'l3':
          color = "#e98074";
          font_color = "white";
          break
        case 'l4':
          //new color not associated, need to generate new darker colors
          color = "#eae7dc";
          font_color = "white";
          break
        case 'l5':
          color = "#d8c3a5";
          font_color = "white";
          break
        case 'l6':
          color = "#d8c3a5";
          font_color = "white";
          break
        case 'l7':
          color = "#d8c3a5";
          font_color = "white";
          break
        case 'l8':
          color = "#d8c3a5";
          font_color = "white";
          break
        case 'l9':
          color = "#d8c3a5";
          font_color = "white";
          break
        case 'dosage':
          color = "#e98074";
          font_color = "white";
          break

        default:
          color = "white";
          font_color = "white";
      }

    }
    /*else{
     // children_count = 0;
      x = y = height = width = block_id = block_name = level_class = level_num = color = font_color = null;
    }*/
  }

  return [x, y, width, height , block_id, block_name, level_class, level_num, color, font_color]
}


//var levelData = [];

// this loop calls the levelData generator and generates horizontal levels (initial inputs are retreived from levels object in the json), number of levels can also be asked from the user
function level_production(f_data, levelData){
  if(f_data){
    for(var i in f_data.levels){
      var ld = levelData_info(f_data.levels[i].level_number)
      levelData.push(
      {
      "x": ld[0], "y": ld[1], "width":ld[2], "height": ld[3], "block_id":ld[4] , "block_name":ld[5], "level_class":ld[6], "level_num" : ld[7],
      "color" : ld[8],
      "font_color" : ld[9]
      }
    )

  }

  }
  return levelData

}

// draws all of edges at the same time
function addEdge(f_data, lines, rectData){
if(f_data){
  for(var i in f_data.edges)
  {
      for(var t in f_data.blocks){

        if(f_data.edges[i].parent === f_data.blocks[t].block_id){
          var nd = [];
          nd = addNode(f_data.blocks[t].level_number, f_data.blocks[t].block_id);

          var parent_x_loc = (nd[0]+nd[2]/2);
          var parent_y_loc = nd[1]+nd[3];
          var parent_id = f_data.edges[i].parent;
          var source_active = true;
        }
        if(f_data.edges[i].child === f_data.blocks[t].block_id){

          var nd1 = [];
          nd1 = addNode(f_data.blocks[t].level_number, f_data.blocks[t].block_id);

          var child_x_loc = nd1[0]+nd1[2]/2;
          var child_y_loc = nd1[1];
          var child_id = f_data.edges[i].child;

          var target_level = f_data.blocks[t].level_number;
          var target_active = true;
          var id  = f_data.edges[i].edge_id;
        }

      }

     lines.push(

    {  'source': [parent_x_loc , parent_y_loc] ,
       'target': [child_x_loc , child_y_loc],
       'parent_id' : parent_id,
       'child_id' : child_id,
       'target_level' : target_level,
       'source_active' : source_active,
       'target_active' : target_active,
       'id' : id

    }

    );


    edge_activation(parent_id, child_id, lines, rectData)

  }


}
return lines

}

//redrawGraph(f_data)
//addEdge();


function edge_activation(parent, child, lines, rectData){
  var parent_active;
  var child_active;
  var source_active;
  var target_active;

  for(var i in lines){
    if(lines[i].parent_id == parent){
     for(var n in rectData){
       if(rectData[n].block_id == lines[i].parent_id ){
          parent_active = rectData[n].active;
          lines[i].source_active = parent_active;
       }
     }
    }
  }
  for(var j in lines){
    if(lines[j].child_id == child){
      for(var m in rectData){
        if(rectData[m].block_id == lines[j].child_id){
          child_active = rectData[m].active;
          lines[j].target_active = child_active;
        }
      }
    }
  }
}
//node_filter(5)
rectData= node_production(f_data, rectData);
levelData= level_production(f_data, levelData);
lines= addEdge(f_data, lines, rectData)

svgWidth = $("#block_1").width()-20;

var svgContainer_rect = d3.select("#block_1").select("svg")
                                             .attr("width",svgWidth)
                                             .attr("position",'fixed')
                                             .attr("height",svgHeight);
var keep_cross;

function update_nodes_mode_1(){
//redraw_nodes();
redrawGraph(f_data)
svgContainer_rect.selectAll("g.node text")
    //.on("click", removeRect);

}



function update_nodes_mode_2(){

 //redraw_nodes();
 redrawGraph(f_data)
 //keep_cross=  svgContainer_rect.selectAll("g.node text").remove();

}

function removeRect(i, d){
  var children = [];
  children =(find_children(d.block_id));
  var selected_block_id = d.block_id
  // alert(d.block_id + ' children : '+ children);
  /*d3.selectAll('g.node.selected_node')
    .transition()
    .attr("stroke", "red")
    .delay(100)
    .duration(300)
    .remove(); */
  //alert(d3.selectAll('g.node').attr('id'));
  d3.select(this).node().parentNode.remove();
  // In case of LEVEL 2 remove all the 3 splitted rects
  //-----------------------------------------------------------------------------------
  if(d.level === "l2") {
    d3.selectAll(".extended-level2").selectAll("rect").each( function(element) {
      var splittRectId = d3.select(this).attr("id")
      if(splittRectId.startsWith(d.block_id.toString())) {
        d3.select(this).node().parentNode.remove()
        /*.transition()
        .attr("stroke", "red")
        .delay(100)
        .duration(300)*/
        //.remove();
      }
    })
  }
  //-----------------------------------------------------------------------------------


  // check block level
  for(var t in f_data.blocks){
    if(f_data.blocks[t].block_id == selected_block_id){
      var block_level = f_data.blocks[t].level_number;
     // console.log(block_level);
      if(block_level == "l0"){
        // delete block in l0 and it's children in l1
          svgContainer_rect.selectAll("g.node").each(function(s,i){
            for(var i in children){
              if(children[i] == s.block_id){
                d3.select(this)
                .transition()
                //.style("color", "red")
                .attr("stroke", "red")
               // .style("stroke", "red")
                .delay(100)
                .duration(100)
                .remove();
              }
            }

          })
        //
      }

    }
  }


//find edges

//remove edges
//check removed nodes and remove those edges as well
//afer level 0, nodes shoukld be deleted only one by one and only related edges not the other nodes
    svgContainer_rect.selectAll("g.edgePath").each(function(r,i){

      if(r.parent_id == selected_block_id){
        //alert(selected_block_id)
        d3.select(this).remove();

      }
      for(var i in children){
          if(children[i] == r.parent_id){
            d3.select(this).remove();
          }

      }

  })

  //remove edges
    svgContainer_rect.selectAll("g.edgePath").each(function(n,i){

      if(n.child_id == selected_block_id){
        ////alert(selected_block_id)
        d3.select(this).remove();

      }
  })

}
// structure maangement


var structure_mode = "mode_1";
mode_1();
document.getElementById("mode_1").classList.add('active_mode');
var clicked_blocks = [];
function click(d){
  clicked_blocks.push(d);
}


document.getElementById("mode_1").onclick = function(){mode_1()};
if(document.getElementById("mode_2")){
  document.getElementById("mode_2").onclick = function(){mode_2()};
}
//document.getElementById("restart").onclick = function(){restart()};

//mode_2();
//change_class("mode_1");

function mode_1(){
  change_class("mode_1");
  //check activation mode
  if ( document.getElementById("mode_1").classList.contains('active_mode') ){
    //alert("default mode is active");
    structure_mode = "mode_1";
    console.log(structure_mode);
    if(document.getElementById("mode_2")){
      if(document.getElementById("mode_2").classList.contains('active_mode')){
        change_class("mode_2");
      }
    }
  }
  else{
    //alert(" default mode is INactive")
  }
 // call_svg();
/* redraw_nodes("node1");
 sort_validations();*/
 update_nodes_mode_1();
}

function mode_2(){
  change_class("mode_2");
  //check activation mode
  if ( document.getElementById("mode_2").classList.contains('active_mode') ){
    //alert("Selection mode is active")
    structure_mode= "mode_2";
    console.log(structure_mode);
    if(document.getElementById("mode_1").classList.contains('active_mode')){
      change_class("mode_1");
    }

  }
  else{
    //alert(" Selection mode is INactive")
  }



 /* redraw_nodes("node2");
  sort_validations(); */
  //update_nodes_mode_2();

 //call_svg();
}

function redraw_nodes(class_mode, rectData, levelData, lines){
  var class_mode;
  if(class_mode){
    class_mode = class_mode;
  }
  else{
    class_mode = "node";
  }

if(svgContainer_rect){
  svgContainer_rect.selectAll("g.node").remove();
  svgContainer_rect.selectAll("g.edgePath").remove();
  svgContainer_rect.selectAll("g").remove();
}
      /*var level_nodes = svgContainer_rect.selectAll("g.level_node")
                                         .data(levelData)
                                         .enter()
                                         .append("g")
                                         .attr("class", "level_node")
                                         .on("click", level_buttons);*/
      var level_nodes = svgContainer_rect.selectAll("g.level_node")
                                  .data(levelData)
                                  .enter()
                                  .append("g")
                                  .attr("class", "level_node")
                                  .style("cursor", function(d) {
                                    return d.level_num === "dosage" ? "default" : "pointer";
                                  })
                                  .on("click", function(event, d) {
                                    if (d.level_num === "dosage") {
                                      return;
                                    }
                                    level_buttons.call(this, event, d);
                                  });


      var level_rects = level_nodes.append("rect")
                                   .attr("x", function (d) { return d.x; })
                                   .attr("y", function (d) { return d.y; })
                                   .attr("width", function (d) { return d.width })
                                   .attr("height", function (d) { return d.height; })
                                   .attr("id", function (d) { return d.block_id; })
                                   .attr("fill", function(d){ return d.color;});
                                  // .attr("stroke", "blue");

      var level_foreginOb = level_nodes.append("foreignObject")
                                      .attr("height", function(d){ return d.height;})
                                      .attr("width", function(d){ return d.width;})
                                      .attr("x", function(d){return d.x})
                                      .attr("y", function(d){return d.y})
                                      .attr("class", "foreign")
                                      .append("xhtml:div")
                                      .attr("xmlns", "http://www.w3.org/1999/xhtml")
                                      .text(function(d){return d.block_name;})
                                      .attr("style",
                                      function(d){
                                      return('font-family: 300 16px "OpenSans-Regular";font-weight: bold; display: grid;text-align: center;height: inherit;align-items: end;writing-mode: vertical-lr; text-orientation: upright; color:'+d.font_color)

                                      });


  var childSvgContainer = svgContainer_rect.append("g").attr("class", "extended-level2")
  var dataLevel2 = rectData.filter(function(d){return d.active && d.level=="l2";})
  var childNodesDataLevel2 = []
  dataLevel2.forEach(function(mainNode) {
    var widthChildProportion = mainNode.width / 3;
    for(var i=1; i<4; i++) {
      var childNode = Object.assign({}, mainNode);
      childNode.x = mainNode.x + widthChildProportion*(i-1);
      childNode.width = widthChildProportion;
      childNode.id = mainNode.block_id + "_part_" + i;
      childNode.isChildNode = true,
      childNode.dl = i;
      childNodesDataLevel2.push(childNode);
    }
  })

  var allLevelsNodeData = rectData.filter(function(d){return d.active; });
  var nodes = svgContainer_rect.selectAll("g."+class_mode)
                                  .data(allLevelsNodeData)
                                  .enter()
                                  .append("g")
                                  .attr("class", class_mode)
                                  .attr("id", function (d) { return d.block_id; });

                                   var rects= nodes.append("rect");


  //var rects= nodes.append("rect");

  var class_mode_extend  = class_mode + "_level_2";
  var childNodesLevel2 = childSvgContainer.selectAll("g."+class_mode_extend)
    .data(childNodesDataLevel2)
    .enter()
    .append("g")
    .attr("class", class_mode)
    .attr("isChild", "True")
    .attr("id", function (d) { return d.id; });


    childNodesLevel2.append("rect")
    .attr("x", function (d) { return d.x; })
    .attr("y", function (d) { return d.y; })
    .attr("width", function (d) { return d.width; })
    .attr("height", function (d) { return d.height; })
    .attr("id", function (d) { return d.id; })
    .attr("rx", 1)
    .attr("ry", 4)
    .attr("fill", function(d){ return d.color;})

    var foreignObjLevel2 = childNodesLevel2.append("text")
                  .attr("x", function(d){
                    let margin = 15;
                    if(d.dl === 2) {
                      margin = margin + 3;
                    }
                    return d.x + d.width/2 - margin;
                  })
                  .attr("y", function(d){return d.y + d.height * 0.78})
                  .attr("dy", ".35em")
                  .attr("class", "level2-DL-Text")
                  .style("fill", "black")
                  .text(function(d){
                    if(d.dl === 1) {
                      return "< 5%"
                    }
                    else if(d.dl === 2) {
                      return "5-10%"
                    }
                    else if(d.dl === 3) {
                      return "> 10%"
                    }
                    return d.dl;
                  })

  var foreignOb = nodes.append("foreignObject")
                .attr("height", function(d){ return d.height+20;})
                .attr("width", function(d){ return d.width;})
                .attr("x", function(d){return d.x})
                .attr("y", function(d){return d.y})
                .append("xhtml:div")
                .attr("xmlns", "http://www.w3.org/1999/xhtml")
                .attr("style", 'font-family:"OpenSans-Regular"; font-size:12px; font-weight: bold ;display: grid;text-align: center;height: inherit;align-items: center; ')
                .text(function(d){return d.block_name;});
                //.attr("class","rectLabel");


  var cross = nodes.append("text")
                  .attr("x", function(d){return d.x+ d.width -15})
                  .attr("y", function(d){return d.y + 10})
                  .attr("dy", ".35em")
                  .style("fill", "red")
                  .text("x")
                  .style('pointer-events', 'auto')
                  .on("click", removeRect);
                  //.on("click", function(d){ alert(d.id)});
                  //.on("click", node_filter(2));

  var count_questions = nodes.append("text")
                  .attr("class", "count_questions")
                  .attr("id","count_questions")
                  .attr("x", function(d){return d.x + 15})
                  .attr("y", function(d){return d.y + d.height - 10})
                  //.attr("y", function(d){return d.y + 10})
                  .attr("dy", ".35em")
                  .style("fill", "gray")
                  //.text(1);
                  .text(function(d){return f_count_questions(d.block_id)} );

  var count_answered_questions = nodes.append("text")
                  .attr("class", "count_answered_questions")
                  .attr("id","count_answered_questions")
                  .attr("x", function(d){return d.x + 2})
                  .attr("y", function(d){return d.y + d.height - 10})
                  //.attr("y", function(d){return d.y + 10})
                  .attr("dy", ".35em")
                  .style("fill", "black")
                  //.text(1);
                  .text(function(d){return f_count_answered_questions(d.block_id)+"/"} );


  var rectAttributes = rects
                        .attr("x", function (d) { return d.x; })
                        .attr("y", function (d) { return d.y; })
                        .attr("width", function (d) { return d.width; })
                        .attr("height", function (d) { return d.height; })
                        .attr("id", function (d) { return d.block_id; })
                        .attr("rx", 1)								// how much to round corners - to be transitioned below
                        .attr("ry", 4)
                        .attr("l_id", function (d){ return d.level})
                        .attr("fill", function(d){
                          if(d.level=="l2") {
                            return "transparent"
                          }
                          return d.color;
                        })
                        .attr("fill-opacity", function(d){
                          if(d.level=="l2") {
                            return "0"
                          }
                          return "1";
                        })

                        //.attr("class", function (d) { return d.class; })

                        .attr("stroke", "black");



    //.attr("class","rectLabel");

  svgContainer_rect.selectAll("g."+class_mode)
      .on("click", showQuestion);



  var edges = svgContainer_rect.selectAll("g.edgePath")
                              .data(lines.filter(function(d){
                                  var show =  d.source_active && d.target_active;
                                  /*if (show)
                                      console.log("edges are active", d);
                                  else
                                      console.log("edges are excluded", d);*/
                                  return show;
                              }))
                              .enter()
                              .append("g")
                              .attr("class", "edgePath")
                              .attr("id", function (d) { return d.id})
                              .attr("target_level", function (d){ return d.target_level})
                              .attr("parent", function (d){ return d.parent_id})
                              .attr("child", function (d){ return d.child_id});


  var linkGen = d3.linkVertical();

  var draw_edges= edges.append("path");

  var lineAttributes =   draw_edges
                        //.style("stroke","gray")
                        .attr("d",linkGen)
                        .attr("fill", "none")
                        .attr("class", function(d){ return d.target_level})
                        .attr("id", function (d) { return d.id})
                        .attr("parent", function (d){ return d.parent_id})
                        .attr("child", function (d){ return d.child_id});
                        //.attr("stroke", "black");


  svgContainer_rect.selectAll("g."+class_mode+" text")
      //.on("click", removeRect);

  sort_validations();
}

function restart(){
 // redraw_nodes();
  redrawGraph(f_data)
structure_mode = "mode_1"
if ( document.getElementById("mode_2").classList.contains('active_mode') ){
   change_class("mode_2");
}
else if ( document.getElementById("mode_1").classList.contains('active_mode') ){
   change_class("mode_1");
}

change_class("mode_1");

// redraw_nodes();
 qs_numbers.splice(0 , qs_numbers.length);
 //sort_validations();


}

var click_order=0;
function save_clicks(block_id, block_status){
  var get_date = Date();
  clicks_object.blocks.push({
      "click_order" : click_order,
      "block_id" : block_id,
      "status" : block_status,
      "time" : get_date
    });
  var send_clicks_object = JSON.stringify(clicks_object);
  Shiny.setInputValue("send_clicks_object", send_clicks_object);
  click_order +=1;
}

svgContainer_rect.selectAll("g.node")
    .on("click", showQuestion);



    svgContainer_rect.selectAll("g.extended-level2 g.node")
    .on("click", showQuestion);

// we should check first whether there is at least a valid block within each level and second, are they connected in a way that they create a path?
function find_result(){
 /* var node = [];
  svgContainer_rect.selectAll("g.node").each(function(d,i){
    if(document.getElementById(d.block_id).classList.contains('valid_node')){
      node.push(d.block_id, d.level);
    }
  })
  var l0, l1, l2, dosage =[];
   for(var i in node){

    var level= node[i][1];
   switch(level){
      case 'l0':
      l0.push(node[i][0]);
      break;
      case 'l1':
      l1.push(node[i][0]);
      break;
      case 'l2':
      l2.push(node[i][0]);
      break;
      case 'dosage':
      dosage.push(node[i][0]);
      break;
    }
  }
*/
  //related_final_valid_edges
  var target_level = [];
  var path_l1, path_l2, path_dosage = [];
  svgContainer_rect.selectAll("g.edgePath").each( function(d,i){
    if(document.getElementById(d.id).classList.contains('related_final_valid_edges')){
      //alert(d.id + '...' + d.target_level + 'type: '+ typeof(d.target_level));

      var cls = d.target_level;
      switch (cls){
        case 'l1':
         path_l1.push(d.class, d.id, d.parent, d.child);
        break;
        case 'l2':
         alert('l2')
         path_l2.push(d.class, d.id, d.parent, d.child);
         break;
        case 'dosage':
         path_dosage.push(d.class, d.id, d.parent, d.child);
         break;
      }
    }
 })
 //node
 for(var a in path_l1){
   for(var b in path_l2){
     if(path_l1[a][3] === path_l2[b][2]){
       alert("there is a path from l1 to l2"+ path_l1[a][3] + "  " + path_l2[b][2] )
     }
   }
 }

}


function find_validity_for_each_question(f_data, block_id, question_id, answer, qs_type){

  // alert(block_id + "-----" + question_id + "-----" +answer)
  for(var q in f_data.questions){
   if(f_data.questions[q].qs_id === question_id){
     var qs_type = f_data.questions[q].qs_type;
   }}
     for(var i in f_data.answers_concept_definition){
       if(f_data.answers_concept_definition[i].qs_id === question_id){
         for(var j in f_data.answers_concept_definition[i].affected_dosage_blocks){
           if(f_data.answers_concept_definition[i].affected_dosage_blocks[j].block_id === block_id ){
             for(var k in f_data.answers_concept_definition[i].affected_dosage_blocks[j].possible_answers){
               var validity;
               switch(qs_type){
                 case 'option':
                   if(f_data.answers_concept_definition[i].affected_dosage_blocks[j].possible_answers[k].value == answer){
                     validity = f_data.answers_concept_definition[i].affected_dosage_blocks[j].possible_answers[k].validity;
                     return(validity);
                   }
                 break;
                 case 'range':
                   var min_value = f_data.answers_concept_definition[i].affected_dosage_blocks[j].possible_answers[k].min;
                   var max_value = f_data.answers_concept_definition[i].affected_dosage_blocks[j].possible_answers[k].max;
                   if( +min_value< +answer && +answer < +max_value){
                     validity = f_data.answers_concept_definition[i].affected_dosage_blocks[j].possible_answers[k].validity;
                     if(validity){
                      return(validity);
                     }
                     else{
                      return
                     }

                   }
                 break;
                 case 'informative':
                  validity = "valid"
                  return(validity)
                break;
                 }
               }
             }
           }
         }
       }
     }

 //block_id, result, question_id, qs_type
 //questionId, questionCondition, questionType, checkDL
function sort_validationxx(questionId, questionCondition, questionType, question_feature, checkDL) {
  //alert(block_id+ " " + questionCondition + " " +  questionId + " " +  questionType)

   let classMapping = {
     "valid": "valid_node",
     "invalid": "invalid_node",
     "maybe_valid": "maybeValid_node",
     "informative": "informative_node"
   };
   var questionRelatedBlocks = f_data.answers_concept_definition.filter(d=>d.qs_id === questionId)
  // var block_id;
   if(questionRelatedBlocks.length > 0) {
     if(checkDL) {
       questionRelatedBlocks = questionRelatedBlocks[0].affected_dosage_blocks.filter(d=> typeof d.dl != "undefined");
      // block_id =
     }
     else {
       questionRelatedBlocks = questionRelatedBlocks[0].affected_dosage_blocks.filter(d=> typeof d.dl === "undefined");
     }
   }
   questionRelatedBlocks = JSON.parse(JSON.stringify(questionRelatedBlocks));
   questionRelatedBlocks.forEach((d)=> {
     var answers = [];
    /* if(answers.length!==0){
      answers.splice(0, answers.length)
    }*/

     if(questionType === "option") {
       var answers = d.possible_answers.filter((answer)=> answer.value === questionCondition);
     }
     else if(questionType === "range") {
       questionCondition = parseFloat(questionCondition);
       var answers = d.possible_answers.filter((answer)=> questionCondition >= answer.min && questionCondition <= answer.max);
     }
   /*  else if(questionType === "informative") {
      var answers = "user input";
    }*/


     if(answers.length == 0 || answers > 1 || questionCondition === '') {
       console.log("error. something is wrong with json definition: correct f_data")
       d.validity = ""
       d.toAssignClass = ""

     }
     else {
       //here check if invalid or maybe_valid class exists or not
       if(document.getElementById(d.block_id+"_part_"+d.dl)){
         if(document.getElementById(d.block_id+"_part_"+d.dl).classList.contains('invalid_node')){
          d.validity = "invalid";
          d.toAssignClass = classMapping[d.validity];
         }
         else if(document.getElementById(d.block_id+"_part_"+d.dl).classList.contains('maybeValid_node')){
          d.validity = "maybeValid_node";
          d.toAssignClass = classMapping[d.validity];
         }
         else if(question_feature === "informative"){
          d.validity ="unknown"
        }

         else{
          d.validity = answers[0].validity;
          d.toAssignClass = classMapping[d.validity];
         }

       }
       if(document.getElementById(d.block_id)){
        if(document.getElementById(d.block_id).classList.contains('invalid_node')
        ){
         //alert("block " + document.getElementById(d.block_id+"_part_"+d.dl) +" is already invalid" + "  can't change the class")
         d.validity = "invalid";
         d.toAssignClass = classMapping[d.validity];
        }
        else if(document.getElementById(d.block_id).classList.contains('maybeValid_node')
        ){
        // alert("block " + document.getElementById(d.block_id+"_part_"+d.dl) +" is already maybe_valid" + "  can't change the class")
         d.validity = "maybe_valid";
         d.toAssignClass = classMapping[d.validity];
       }
       else {
        d.validity = answers[0].validity;
        d.toAssignClass = classMapping[d.validity];
      }
       }

      // alert(d.block_id + " " + d.validity + d.dl)
     }
   });
  // console.log(questionRelatedBlocks)
   return questionRelatedBlocks;
 }

 function sort_validation2(questionId, questionCondition, questionType, question_feature, checkDL) {
  //alert(block_id+ " " + questionCondition + " " +  questionId + " " +  questionType)
  //console.log(question_feature)
  let relatedQuestions = f_data.questions.filter((d) => d.qs_id === questionId)
  questionLevel = null
  if(relatedQuestions.length === 0) {
    console.log("something is wrong with JSON file definition")
  }
  else {
    questionLevel = relatedQuestions[0]["level_number"]
  }

  let classMapping = {
    "valid": "valid_node",
    "invalid": "invalid_node",
    "maybe_valid": "maybeValid_node",
    "informative": "informative_node"

  };


  var questionRelatedBlocks = f_data.answers_concept_definition.filter(d=>d.qs_id === questionId)
  if(questionRelatedBlocks.length > 0) {
    if(checkDL) {
      questionRelatedBlocks = questionRelatedBlocks[0].affected_dosage_blocks.filter(d=> typeof d.dl != "undefined");
    }
    else {
      questionRelatedBlocks = questionRelatedBlocks[0].affected_dosage_blocks.filter(d=> typeof d.dl === "undefined");
    }
  }
  questionRelatedBlocks = JSON.parse(JSON.stringify(questionRelatedBlocks));
  questionRelatedBlocks.forEach((d)=> {
    var answers = [];
    if(questionLevel === "dosage") {
      let drugLoading = questionCondition
      let validity = ""
      if( drugLoading < 50 ) {
        validity = "valid"
      }
      else if( drugLoading >= 50 && drugLoading <= 100 ) {
        validity = "maybe_valid"
      }
      else if(drugLoading > 100 ) {
        validity = "invalid"
      }
      if(validity != "") {
        answers.push({
          validity: validity
        })
      }
    }
    else {
      if(questionType === "option") {
        var answers = d.possible_answers.filter((answer)=> answer.value === questionCondition);
      }
      else if(questionType === "range") {
        questionCondition = parseFloat(questionCondition);
        var answers = d.possible_answers.filter((answer)=> questionCondition >= answer.min && questionCondition <= answer.max);
      }
      /*else if(questionType === "informative") {
        var answers = "user input";
      }*/

    }

    if(answers.length == 0) {


      console.log("something is wrong with json definition: correct f_data, there is no answer to the question according to json definition")

      d.validity = " "

      d.toAssignClass = classMapping[d.validity];

    }

    else if(question_feature!== "informative") {
      d.validity = answers[0].validity;
      d.toAssignClass = classMapping[d.validity];
    }
    else if(question_feature === "informative"){
      d.validity = "informative";
    }
    if(d.validity != "invalid" && d.validity != "informative") {
      let block_id = d.block_id
      let dl = d.dl
      let blockAllAnswers = []
      if(typeof dl === "undefined") {
        dl= "undefined"
      }
      blockAllAnswers = answers_object.answers.filter((o) => o.validations.some((v) => v.block_id  === block_id && v.dl === dl))

      for(let curr_answer of blockAllAnswers) {
        let curr_blockIdIndex = curr_answer.validations.findIndex((v) =>  v.block_id  === block_id && v.dl === dl )
        let curr_blockValidity = curr_answer.validations[curr_blockIdIndex].validity
        //console.log(curr_blockValidity)

        if(curr_blockValidity === "invalid") {
          d.toAssignClass =  classMapping[curr_blockValidity];
          break;
        }
        else if(curr_blockValidity === "maybe_valid") {
          d.toAssignClass =  classMapping[curr_blockValidity];
        }
      }
    }
  });
  return questionRelatedBlocks;
 }

  //pr1: when erases the css after click on remove answer, clears the highlight but doesnt remember the highlight of other blocks to update
 function valid_node2(clicked_node, question_id, inselect, qs_type, question_feature){
  //var checkDL;
  var questionRelatedDLBlocks = sort_validation2(question_id, inselect, qs_type,question_feature, true);
  var questionRelatedNonDLBlocks = sort_validation2(question_id, inselect, qs_type,question_feature, false);
 //use same function for manual validation as well, check whether any question was involved or not

  svgContainer_rect.selectAll("g.node").each(function(d,i){
     var blockWithAffectedDosage = null;
    if(d.level === "l2") {
      blockWithAffectedDosage = questionRelatedDLBlocks.filter((entry) => entry.block_id == d.block_id && entry.dl === d.dl );
    }
    else {
      blockWithAffectedDosage = questionRelatedNonDLBlocks.filter((entry) => entry.block_id == d.block_id );
    }
    if(blockWithAffectedDosage != null && blockWithAffectedDosage.length > 0 && blockWithAffectedDosage[0].validity != "unknown" && blockWithAffectedDosage[0].validity != "" &&  blockWithAffectedDosage[0].validity != "informative"){
        d3.select(this).classed("valid_node", false);
        d3.select(this).classed("invalid_node", false);
        d3.select(this).classed("maybeValid_node", false);
        d3.select(this).classed(blockWithAffectedDosage[0].toAssignClass, true);

        //alert("to assign: "+ blockWithAffectedDosage[0].toAssignClass + "dl: "+ d.dl)
        //check if invalid or maybe class exists
   }
  });

  showEdges()
  show_final_edges()
  updateDosageBlocksFromFinalEdges()
 }

document.getElementById("screenshot").onclick = function (){setColorsForScreenshot()};

function setColorsForScreenshot() {
 let classMapping = {
 "valid": "#d5feec",
 "invalid": "#fbbfc7",
 "maybe_valid": "#fddea5"
};

svgContainer_rect.selectAll("g.node").each(function(d,i){
    let setClass ="";
    if(d3.select(this).classed("valid_node")) {
      setClass = "valid"
      }
      else if(d3.select(this).classed("invalid_node")) {
      setClass = "invalid"
      }
      else if(d3.select(this).classed("maybeValid_node")) {
      setClass = "maybe_valid"
      }
      if(setClass != "") {
        d3.select(this).select("rect").attr("fill", classMapping[setClass])
        }
  })
}

 function find_current_validation(block_id){
  // alert('entered')
  var val;
  var block_id;
  var ids = [];
  var vals = [];
  var block = []
    for(let dl=1 ;dl<4 ; dl++){
      if(document.getElementById( block_id+"_part_"+dl) != null){
        if(document.getElementById(block_id+"_part_"+dl).classList.contains("valid_node")){
          val = "valid"
          ids.push(block_id+"_part_"+dl)
          vals.push(val)
          block.push(block_id+"_part_"+dl, val)
        }
        else if(document.getElementById(block_id+"_part_"+dl).classList.contains("invalid_node")){
          val = "invalid"
          block.push(block_id+"_part_"+dl, val)
          ids.push(block_id+"_part_"+dl)
          vals.push(val)

        }
        else if(document.getElementById(block_id+"_part_"+dl).classList.contains("maybeValid_node")){
          val="maybe_valid"
          block.push(block_id+"_part_"+dl, val)
          ids.push(block_id+"_part_"+dl)
         vals.push(val)

        }
        /*else{
          val="undefined"
          block.push(block_id+"_part_"+dl, val)
        }*/
      }
  //    return block
    }

    if(document.getElementById(block_id)!= null){
      if(document.getElementById(block_id).classList.contains("valid_node")){
        val = "valid"
        block.push(block_id, val)
        ids.push(block_id)
        vals.push(val)

      }
      else if(document.getElementById(block_id).classList.contains("invalid_node")){
        val = "invalid"
        block.push(block_id, val)
        ids.push(block_id)
        vals.push(val)

      }
      else if(document.getElementById(block_id).classList.contains("maybeValid_node")){
        val="maybe_valid"
        block.push(block_id, val)
        ids.push(block_id)
        vals.push(val)

      }
     /* else{
        val="undefined"
        block.push(block_id, val)
        ids.push(block_id)
        vals.push(val)

      }*/
    }
   // return (block)
  // alert(ids)
 // alert("function: "+ids+vals)
   return[ids, vals]
  }

/*const screenshotTarget = document.body;

html2canvas(screenshotTarget).then((canvas) => {
    const base64image = canvas.toDataURL("image/png");
    window.location.href = base64image;
});*/

function getQuestionRelatedBlocks1(questionId, questionCondition, questionType, question_feature, checkDL) {
  let relatedQuestions = f_data.questions.filter((d) => d.qs_id === questionId)
  questionLevel = null
  if(relatedQuestions.length === 0) {
    console.log("something is wrong with JSON file definition")
  }
  else {
    questionLevel = relatedQuestions[0]["level_number"]
  }

  let classMapping = {
    "valid": "related_valid_node",
    "invalid": "related_invalid_node",
    "maybe_valid": "related_maybeValid_node"
  };
  var questionRelatedBlocks = f_data.answers_concept_definition.filter(d=>d.qs_id === questionId)
  if(questionRelatedBlocks.length > 0) {
    if(checkDL) {
      questionRelatedBlocks = questionRelatedBlocks[0].affected_dosage_blocks.filter(d=> typeof d.dl != "undefined");
    }
    else {
      questionRelatedBlocks = questionRelatedBlocks[0].affected_dosage_blocks.filter(d=> typeof d.dl === "undefined");
    }
  }
  questionRelatedBlocks = JSON.parse(JSON.stringify(questionRelatedBlocks));
  questionRelatedBlocks.forEach((d)=> {
    var answers = [];
    if(questionLevel === "dosage") {
      let drugLoading = questionCondition
      let validity = ""
      if( drugLoading < 50 ) {
        validity = "valid"
      }
      else if( drugLoading >= 50 && drugLoading <= 100 ) {
        validity = "maybe_valid"
      }
      else if(drugLoading > 100 ) {
        validity = "invalid"
      }
      if(validity != "") {
        answers.push({
          validity: validity
        })
      }
    }
    else {
      if(questionType === "option") {
        var answers = d.possible_answers.filter((answer)=> answer.value === questionCondition);
      }
      else if(questionType === "range") {
        questionCondition = parseFloat(questionCondition);
        var answers = d.possible_answers.filter((answer)=> questionCondition >= answer.min && questionCondition <= answer.max);
      }
    /*  else if(questionType === "informative") {
        var answers = "user input";
      }*/

    }

    if(answers.length === 0 ) {
      console.log("something is wrong with json definition: correct f_data")
      d.validity = "invalid";
      d.toAssignClass = classMapping["invalid"]
    }
    if(question_feature === "informative"){
      d.validity ="unknown"
    }
    else {
      d.validity = answers[0].validity;
      d.toAssignClass = classMapping[d.validity];
    }
  });
  return questionRelatedBlocks;
}


function updateQuestionAnswer(question_id, inselect, qs_type) {
  var questionRelatedDLBlocks = getQuestionRelatedBlocks1(question_id, inselect, qs_type, qs_feature,true);
  var questionRelatedNonDLBlocks = getQuestionRelatedBlocks1(question_id, inselect, qs_type, qs_feature, false);
  var questionRelatedBlocksMerged = questionRelatedDLBlocks.concat(questionRelatedNonDLBlocks)
  var blockIdList = questionRelatedBlocksMerged.map((d)=> d["block_id"])

  var blocksValdityStatus = questionRelatedBlocksMerged.map((d)=> d["validity"])
  var blockDLs = questionRelatedBlocksMerged.filter((d) => typeof d["dl"] != "undefined").map((d)=> d["dl"])
  var blockValidations = questionRelatedBlocksMerged.map((d) => {
    let validity = d["validity"];

    var validation = {
      block_id: d["block_id"],
      validity: validity,
      dl: typeof(d["dl"]) === "undefined" ? "undefined" : d["dl"]
    }
    return validation
  })

  var answerToQuestionIndex = answers_object.answers.findIndex((d) => d["question_id"] === question_id)
  var answerRecord = {
      "question_id": question_id,
      "qs_type": qs_type,
      "qs_feature" : qs_feature,
      "answer": inselect,
      "input": input,
      "comment" : get_comment,
      "time": Date() ,
      "block_id": blockIdList ,
      "block_validity": blocksValdityStatus,
      "validations": blockValidations
  }
  if(answerToQuestionIndex > -1) {
    answers_object.answers[answerToQuestionIndex] = answerRecord;
  }
  else {
    answers_object.answers.push(answerRecord);
  }
}


//----------------------------------------------------
// code related to new questions
var questionHandler = new function() {
  let questionData = null;
  let initialOptions = null;
  let $formulatedQuestion = null;
  let $isInformativeCheck = null;
  let $hasRangeCheck = null;
  let $numOfOptions = null;
  let $optionStepsContainer = null;
  let $optionValue = null;
  let $optionRangeContainer = null;
  let $activeOption = null;
  let $optionMinValue = null;
  let $optionMaxValue = null;
  let $newOptionBtn = null;
  let $createQuestionBtn = null;
  let f_data_copy = {}
  function initalizeNewQuestionModal() {
    var $newQuestionModal = $(`<div class="modal fade" id="newQuestionModal" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title" id="modalLabel">Create a new Question</h4>
          </div>
          <div class="modal-body" style="padding:15px">
              <div class="container-fluid">
                  <div class="">
                      <div class="row question-row">
                          <div class="col-xs-2">
                              Question
                            </div>
                          <div class="col-xs-10">
                              <textarea class="form-control" id="questionInputField" rows="1"></textarea>
                          </div>
                      </div>
                      <div class="row question-row">
                          <div class="col-xs-2">
                              Settings
                          </div>
                                    <div class="col-xs-2">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" value="" id="questionInformativeCb">
                                            <label class="form-check-label" for="questionInformativeCb">
                                              Is Informative
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-xs-2">
                                        <div class="form-check form-check-inline">
                                            <input class="form-check-input" type="checkbox" value="" id="questionRangeCb">
                                            <label class="form-check-label" for="questionRangeCb">
                                              Has Range
                                            </label>
                                        </div>
                                    </div>
                                    <div class="col-xs-3">
                                        <div class="row question-row">

                                            <div class="col-xs-6">
                                              Number of Options
                                            </div>
                                            <div class="col-xs-6">
                                                <select  class="form-control" id="questionnumOfOptionselection">
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                    <option value="6">6</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                  <div class="col-xs-3">
                                    <div class="row question-row">

                                        <div class="col-xs-4">
                                          Level
                                        </div>
                                        <div class="col-xs-8">
                                            <select  class="form-control" id="levelOfNewQuestion">
                                                <option value="general">general</option>
                                                <option value="l0">level 0</option>
                                                <option value="l1">Level 1</option>
                                                <option value="l2">Level 2</option>
                                                <option value="dosage">Dosage</option>

                                            </select>
                                    </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <fieldset class="scheduler-border">
                      <legend class="scheduler-border">Option Settings</legend>
                      <div class="row question-row">
                        <div id="optionStepsContainer" style="display:flex; justify-content: center;flex-direction:row; gap:6px">

                        </div>
                      </div>
                      <div class="row question-row">
                        <h3 id="questionActiveOption">Option 1</h3>
                      </div>

                      <div class="row question-row">
                        <div class="col-xs-2">
                            Value
                        </div>
                        <div class="col-xs-10">
                            <input type="text" class="form-control" id="questionOptionValue"></input>
                        </div>
                      </div>

                      <div id="questionRangeContainer" class="row question-row">
                          <div class="col-xs-2">
                              Range
                          </div>
                          <div class="col-xs-10">
                              <div class="row question-row ">
                                  <div class="col-xs-6">
                                      <div class="row question-row ">
                                          <div class="col-xs-3">
                                              Min Value:
                                          </div>
                                          <div class="col-xs-6">
                                              <input id="qustionOptionMinValue" type="number"></input>
                                          </div>
                                      </div>
                                  </div>
                                  <div class="col-xs-6">
                                      <div class="row question-row ">
                                          <div class="col-xs-3">
                                              Max Value:
                                          </div>
                                          <div class="col-xs-6">
                                              <input id="qustionOptionMaxValue" type="number"></input>
                                          </div>
                                      </div>
                                  </div>
                                </div>
                          </div>
                      </div>
                      <button id="questionAddOptionBtn" class="btn form-control question-btn action-button modal_button shiny-bound-input" id="addQuestionOptBtn" type="button">Update Option</button>

                  </fieldset>
              </div><!--/container-fluid-->
          </div>
          <div class="modal-footer">
            <button id="questionCancelBtn" type="button" class="btn btn-secondary">Close</button>
            <button id="questionCreateBtn" type="button" class="btn question-btn action-button modal_button">Save Changes</button>
          </div>
        </div>
      </div>
    </div>`)
    $newQuestionModal.appendTo("body")
    questionHandler.subscribeEvents();
  }

  function subscribeEvents() {
    $("#createNewQuestionBtn").click( () => {
      $('#newQuestionModal').modal()
      questionHandler.setEmptyData();
      $newOptionBtn.prop('disabled', true)
      $createQuestionBtn.prop('disabled', true)
      questionHandler.formulateQuestion()
    })

    $formulatedQuestion = $("#questionInputField");
    $isInformativeCheck = $("#questionInformativeCb");
    $hasRangeCheck = $("#questionRangeCb");
    $numOfOptions = $("#questionnumOfOptionselection");
    $optionStepsContainer = $("#optionStepsContainer");
    $optionValue = $("#questionOptionValue");
    $optionRangeContainer = $("#questionRangeContainer");
    $activeOption = $("#questionActiveOption")
    $optionMinValue = $("#qustionOptionMinValue");
    $optionMaxValue = $("#qustionOptionMaxValue");
    $newOptionBtn = $("#questionAddOptionBtn");
    $createQuestionBtn = $("#questionCreateBtn");
    $cancelQuestionBtn = $("#questionCancelBtn");
    $levelOfNewQuestion = $("#levelOfNewQuestion")

    if(questionData === null) {
      setEmptyData();
    }
    $formulatedQuestion.bind("input change", function() {
      console.log()
    });

    $isInformativeCheck.click(function() {
      questionData.isInformative = $(this).is(':checked')
    });

    $hasRangeCheck.click(function() {
      questionData.hasRange = $(this).is(':checked')
      questionHandler.activateOption();
      questionHandler.formulateQuestion();

    });

    $levelOfNewQuestion.on('change', function () {
        questionData.level =  $('option:selected',this).val();

    })

    $numOfOptions.on('change', function () {
      let selectedNumOptions =  parseInt($('option:selected',this).val());
      questionData.numOfOptions = selectedNumOptions;

      for(var i=0; i < questionData.options.length; i++) {
          initialOptions[i] =  questionData.options[i]
      }
      questionData.options = []
      for(var i=0; i < selectedNumOptions; i++) {
        questionData.options.push(initialOptions[i]);
      }
      questionHandler.formulateQuestion();

    });

    $optionMinValue.on('change keyup', function() {
      let minValue = parseFloat($(this).val())
      questionData.options[questionData.optionActive].min = minValue
      questionHandler.checkOptionProgress();
    });

    $optionMaxValue.on('change keyup', function() {
      let maxValue = parseFloat($(this).val())
      questionData.options[questionData.optionActive].max = maxValue
      questionHandler.checkOptionProgress();
    });

    $optionValue.on('change keyup paste', function () {
      questionData.options[questionData.optionActive].value = $(this).val();
      if(questionData.options[questionData.optionActive].value == "") {
        let $progress = $(".question-option-progress[option='" + (questionData.optionActive+1) + "']");
        if($progress.length) {
          $progress.removeClass("done")
          questionData.options[questionData.optionActive].status = null
        }
        $newOptionBtn.prop('disabled', true)
        $createQuestionBtn.prop('disabled', true)
      }
      else {
        questionHandler.checkOptionProgress();
      }

    })

    $formulatedQuestion.on('change keyup paste', function () {
      questionData.question = $(this).val();
      questionHandler.checkOptionProgress();

    })

    var ranges= [];
    $newOptionBtn.click(function() {
      ranges.splice(0, ranges.length)
      questionData.options[questionData.optionActive].status = "done"
      let $progress = $(".question-option-progress[option='" + (questionData.optionActive+1) + "']");
      if($progress.length) {
        $progress.addClass("done")
      }
      questionData.options[questionData.optionActive].value = $optionValue.val()
      initialOptions[questionData.optionActive].value = $optionValue.val()
      if(questionData.hasRange) {
          questionData.options[questionData.optionActive].min = parseFloat($optionMinValue.val())
          questionData.options[questionData.optionActive].max= parseFloat($optionMaxValue.val())
          initialOptions[questionData.optionActive].min = parseFloat($optionMinValue.val())
          initialOptions[questionData.optionActive].max= parseFloat($optionMaxValue.val())
      }

      questionHandler.checkOptionProgress();
      if(questionData.numOfOptions > (questionData.optionActive+1)) {
        questionData.optionActive = questionData.optionActive + 1;
        questionHandler.activateOption();
      }
    })


    $createQuestionBtn.click(function() {
      let questionId = questionData.questionId;
      if(questionId === null) {
        let maxId = Math.max(...f_data.questions.map((d) => parseInt(d.qs_id))) + 1
        questionId = maxId.toString()
      }
      f_data_copy = JSON.parse(JSON.stringify(f_data));
      var question_type = questionData.hasRange ? "range" : "option";

      let newQuestionObj = {
        "qs_id":questionId,
        "level_number": questionData.level,
        "qs_type": questionData.hasRange ? "range" : "option",
        "qs_feature": questionData.isInformative ? "informative" : "",
        "question" : questionData.question
      }

      let possibleAnswers = []
      for(let i=0; i < questionData.options.length; i++) {
        let answerObj = questionHandler.getParsedAnswerOption(i)
        possibleAnswers.push(answerObj)
      }
      if(questionData.questionId === null) {
        f_data.questions.unshift(newQuestionObj)
        //f_data.questions.push(newQuestionObj)
      }
      else {
        let questionIndex = f_data.questions.findIndex((d) => d.qs_id === questionId)
        if(questionIndex === -1) {
          console.log("question index does not exists: something wrong in data structure")
        }
        else {
          f_data.questions[questionIndex] = newQuestionObj
        }
      }

      if(!("newQuestionOptions" in f_data)) {
        f_data["newQuestionOptions"] = {}
      }
      f_data["newQuestionOptions"][questionId] = possibleAnswers;

      let answerOptionIndex = f_data["answers_concept_definition"].findIndex((d) => d.qs_id === questionId)
      if(answerOptionIndex > -1) {
          f_data["answers_concept_definition"][answerOptionIndex]["affected_dosage_blocks"].forEach((affectedDosageBlocks) => {
              blockPossibleAnswers = affectedDosageBlocks["possible_answers"]
              let prevOptionSize = blockPossibleAnswers.length
              let newOptionSize = possibleAnswers.length;
              if(prevOptionSize > newOptionSize) {
                blockPossibleAnswers.slice(0, newOptionSize)
              }
              for(let i=0; i <possibleAnswers.length; i++) {
                let answerObj = possibleAnswers[i]
                if( i < blockPossibleAnswers.length) {
                    answerObj["validity"] = blockPossibleAnswers[i].validity;
                    answerObj["comment"] = blockPossibleAnswers[i].comment;
                    blockPossibleAnswers[i] = answerObj;
                }
                else {
                  blockPossibleAnswers.push(answerObj)
                }
              }
          })

      }
      //let updatedDataset = JSON.stringify(f_data)
      //Shiny.setInputValue("updatedDataset", updatedDataset);
      answers_object["f_data"] = f_data;
      var send_json = JSON.stringify(answers_object)
      Shiny.setInputValue("send_json", send_json);

     // Shiny.onInputChange("js_question_type", question_type);
  /*    if(question_type === "range"){
        Shiny.onInputChange("ranges", ranges);
        alert(question_type)
        alert(question_type+"raGES :"+ ranges)
      }
      else {
        alert(question_type)
      }
*/

      $('#newQuestionModal').modal("hide")
      all();
      redrawGraph(f_data)
    })
    $cancelQuestionBtn.click(function() {
        f_data = JSON.parse(JSON.stringify(f_data_copy));
        $('#newQuestionModal').modal("hide")
    })


  }
  function getParsedAnswerOption(index) {
      let option = questionData.options[index]
      let answerObj = {
        "option_id": `o${index+1}`,
        "value": option.value,
        "validity": "",
        "comment": " "
      }

      if(questionData.hasRange) {
        answerObj["min"] = option.min;
        answerObj["max"] = option.max;
      }

      return answerObj;
  }

  function checkOptionProgress() {
    let optionData = questionData.options[questionData.optionActive];
    let initalOptionData = initialOptions[questionData.optionActive];
    let disabled = true;
    if(optionData.value != "" && questionData.hasRange && optionData.min != "" && optionData.max != "") {
      disabled = false;
    }
    else if(optionData.value != "" && !questionData.hasRange) {
      disabled = false;
    }
    if(disabled == false) {
      if(optionData.value == initalOptionData.value && optionData.min == initalOptionData.min  && optionData.max == initalOptionData.max ) {
         // disabled = true;
      }
    }
    $newOptionBtn.prop('disabled', disabled)
    let saveChangesBtnDisabled = true;
    if(questionData.formulatedQuestion != "") {
      saveChangesBtnDisabled = !questionData.options.every( (d) => d.status != null)
    }
    $createQuestionBtn.prop('disabled', saveChangesBtnDisabled)
  }

  function setEmptyData() {
    initialOptions = []
    for(var i=0; i < 6; i++) {
      initialOptions.push({
        value: "",
        min: "",
        max: "",
        status: ""
      })
    }
    questionData = {
      questionId: null,
      question: "",
      isInformative: true,
      hasRange: true,
      numOfOptions: 1,
      level: "general",
      options: [
        {
          value: "",
          min: "",
          max: "",
          status: null // "done" // null
        }
      ],
      optionActive: 0,

    };
    //questionData.options = []
  }

  function formulateQuestion() {
      $formulatedQuestion.val(questionData.question)
      $isInformativeCheck.prop('checked', questionData.isInformative);
      $hasRangeCheck.prop('checked', questionData.hasRange);
      $numOfOptions.val(`${questionData.numOfOptions}`)//.change();
      $levelOfNewQuestion.val(questionData.level)

      // $optionStepsContainer = $("#optionStepsContainer");
      // $optionRangeContainer = $("#questionRangeContainer");
      if(!questionData.hasRange) {
        $optionRangeContainer.hide()
      }
      if(questionData.options.length > 0) {
        $optionValue.val(questionData.options[0].value)
        $optionMinValue.val(questionData.options[0].min)
        $optionMaxValue.val(questionData.options[0].max)
      }

      let numOfOptions = parseInt($numOfOptions.find(":selected").val())
      $optionStepsContainer.empty();
      for(let numbOption=1;  numbOption <= numOfOptions; numbOption++ ) {
          let done = questionData.options[numbOption-1].status;
          if(done == null) {
            done = ""
          }
          let $option = $(`<div class="question-option-progress ${done}" option="${numbOption}">${numbOption}</div>`)
          $option.appendTo($optionStepsContainer)
          $option.click(function() {
            let currOptionActive = parseInt($(this).attr("option"))-1
            if(currOptionActive !=  questionData.optionActive) {
              questionData.optionActive = currOptionActive;
              questionHandler.activateOption();

            }
          })
      }
      questionHandler.activateOption();
  }

  function deleteQuestion(questionId) {
      f_data.questions = f_data.questions.filter((d)=> parseInt(d.qs_id) != parseInt(questionId))
      f_data.answers_concept_definition = f_data.answers_concept_definition.filter((d) => parseInt(d.qs_id) != parseInt(questionId));
      f_data.question_block_links = f_data.question_block_links.filter((link)=> parseInt(link["qs_id"]) != parseInt(questionId))
      answers_object["f_data"] = f_data;
      var send_json = JSON.stringify(answers_object)
      Shiny.setInputValue("send_json", send_json);
  }

  function editQuestion(questionId) {
      $('#newQuestionModal').modal()
      questionHandler.setEmptyData();
      f_data_copy = JSON.parse(JSON.stringify(f_data));
      questionData.options = []


      let questionObjects = f_data.questions.filter((d) => d.qs_id === questionId)
      let optionObjects = f_data.answers_concept_definition.filter((d) => d.qs_id === questionId)
      let possibleAnswers = []
      if(optionObjects.length === 0) {
          if("newQuestionOptions" in f_data) {
            possibleAnswers = f_data["newQuestionOptions"][questionId];
          }
      }
      else {
          possibleAnswers = optionObjects[0].affected_dosage_blocks[0].possible_answers
      }
      if(questionObjects.length > 0 && possibleAnswers.length > 0) {
          questionData.hasRange = questionObjects[0]["qs_type"] === "range" ? true : false
          questionData.question = questionObjects[0]["question"]
          questionData.isInformative = questionObjects[0]["qs_feature"] === "informative" ? true: false
          questionData.level = questionObjects[0]["level_number"]


          questionData.numOfOptions = possibleAnswers.length
          let index = 0;
          for(let optionObj of  possibleAnswers) {
              questionData.options.push({
                  value: optionObj.value,
                  min: typeof(optionObj.min) === "undefined" ? "": parseFloat(optionObj.min),
                  max: typeof(optionObj.max) === "undefined" ? "": parseFloat(optionObj.max),
                  status: "done" // "done" // null
              })

              initialOptions[index] = {
                  value: optionObj.value,
                  min: typeof(optionObj.min) === "undefined" ? "": parseFloat(optionObj.min),
                  max: typeof(optionObj.max) === "undefined" ? "": parseFloat(optionObj.max),
                  status: "done" // "done" // null
              }
              index = index + 1;
          }
      }
      questionData.questionId = questionId;
      questionHandler.formulateQuestion()

  }

  function activateOption() {
    if( questionData.options.length > 0 && questionData.optionActive <= questionData.options.length) {
      let optionData = questionData.options[questionData.optionActive]
      if(questionData.hasRange) {
        $optionRangeContainer.show()
        $optionMinValue.val(optionData.min)
        $optionMaxValue.val(optionData.max)
      }
      else {
        $optionRangeContainer.hide()

      }
      var activeValue = parseInt(questionData.optionActive) + 1
      $activeOption.html(`Option ${activeValue}`)
      $optionValue.val(optionData.value)
      $(".question-option-progress").removeClass("active")
      let $progress = $(".question-option-progress[option='" + (questionData.optionActive+1) + "']");
      if($progress.length) {
        $progress.addClass("active")
      }
      questionHandler.checkOptionProgress()
    }
  }

  return {
    setEmptyData,
    getParsedAnswerOption,
    initalizeNewQuestionModal,
    subscribeEvents,
    editQuestion,
    deleteQuestion,
    formulateQuestion,
    activateOption,
    checkOptionProgress
  }
}


// code related to block
//----------------------------------------------------
// code related to new questions
var blockHandler = new function() {
  let data = {
      "isDLBlock": false,
      "NumOfDLs": 0,
      "isNewBlock": true,
      "blockIndex": -1,
      "blockId": "",
      "originBlockLevel":"",
      "blockLevel": "l0",
      "blockName": "",
      "blockClass": "",
      "blockColor": "#f7f7f7",
      "blockPosition": "",
      "blocks" : [],
      "questions": [],
      "selectedOptions": {
          "questionData": {},
          "questionId": "",
          "tableData": []
      }
  }
  let $newBlockLevelSelection = null
  let blockConnectionsTable = null
  let blockQuestionsTable = null
  let optionTable = null
  let f_data_copy = null
  let answers_object_copy;

  function initalizeNewBlockModal() {
    var $newQuestionModal = $(`<div class="modal fade" id="newBlockModal" role="dialog" aria-labelledby="modalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            <h4 class="modal-title" id="modalLabel">Create a new Block</h4>
          </div>
          <div class="modal-body" style="padding:15px 15px 0px 15px;">
              <div class="container-fluid">
                  <div class="">
                      <div class="row question-row">
                          <div class="col-xs-2">
                              Block Level*
                          </div>
                          <div class="col-xs-3">
                              <select  class="form-control" id="levelOfNewBlock">
                                  <option value="l0">Level 0</option>
                                  <option value="l1">Level 1</option>
                                  <option value="l2">Level 2</option>
                                  <option value="dosage">Dosage</option>
                              </select>
                          </div>
                          <div class="col-xs-2">
                              Block Name*
                            </div>
                              <div class="col-xs-5">
                                  <input type="text" class="form-control" id="blockInputNameField"></input>
                              </div>
                          </div>
                      </div>

                      <div class="row question-row">
                          <div class="col-xs-2">
                              Block Class*
                          </div>
                          <div class="col-xs-3">
                              <input type="text" class="form-control" id="blockInputClassField"></input>
                          </div>
                          <div class="col-xs-2">
                              Block Color*
                          </div>
                          <div class="col-xs-5">
                              <input class="form-control" type="color" id="blockInputColorField" value="#f7f7f7">
                          </div>

                      </div>
                  </div>
                  <fieldset class="scheduler-border">
                      <legend class="scheduler-border">Set Block Connections</legend>
                      <div id="newBlockConnectionTable"></div>
                  </fieldset>

                  <fieldset class="scheduler-border">
                      <legend class="scheduler-border">Set Block Questions</legend>
                      <div id="newBlockQuestionsTable"></div>
                      <div id="questionOptionTableContainer" style="display:flex; justify-content: center; flex-direction: column; padding:10px; gap:10px;">
                          <div id="questionOptionTable"></div>
                          <div class="row">
                              <div class="col-xs-3"></div>
                              <div class="col-xs-6 block-assign-btn" id="blockOptionAssignBtn">
                                    <button style="width: 100%; background-color:green; color:white;" type="button" class="btn btn-secondary" >Assign Question</button>
                              </div>
                              <div class="col-xs-6 block-assign-btn" id="blockOptionDissmissBtn">
                                    <button  style="width: 100%; background-color:red; color:white;" type="button" class="btn btn-secondary" >Retract Question</button>
                              </div>
                              <div class="col-xs-6 block-assign-btn" id="blockOptionDisabledBtn">
                                    <button  style="width: 100%; background-color:gray; color:white;" type="button" class="btn btn-secondary" >Disabled Question</button>
                              </div>
                              <div class="col-xs-3"></div>
                          </div>

                      </div>

                  </fieldset>
              </div>
              <div class="modal-footer">
                  <button id="blockCancelBtn"  type="button" class="btn btn-secondary">Close</button>
                  <button id="blockCreateBtn" type="button" class="btn question-btn action-button modal_button">Save Changes</button>
              </div>
          </div>

        </div>
      </div>
    </div>`)
    $newQuestionModal.appendTo("body")
    blockHandler.subscribeEvents();
  }
  function updateBlockTableData() {
    data.blocks = [];

    if(data.blockLevel === "") {
      return;
    }
    let connectableBlockLevels = [];
    if(data.blockLevel === "l0") {
      connectableBlockLevels = ["l1"]
    }
    else if(data.blockLevel === "l1") {
      connectableBlockLevels = ["l0", "l2"]
    }
    else if(data.blockLevel === "l2") {
      connectableBlockLevels = ["l1", "dosage"]
    }
    else if(data.blockLevel === "dosage") {
      connectableBlockLevels = ["l2"]
    }
    let connectedBlockIds = new Set();

    if(data.blockId != "") {
      let filteredBlockIds = f_data.edges.filter((d) => d.parent === data.blockId).map((d) => d.child)
      filteredBlockIds = filteredBlockIds.concat(f_data.edges.filter((d) => d.child === data.blockId).map((d) => d.parent))
      if(filteredBlockIds.length > 0) {
        connectedBlockIds = new Set(filteredBlockIds)
      }

    }

    for(let block of f_data.blocks) {
      let level = block["level_number"]
      if(level != "dosage") {
        level = parseInt(block["level_number"].replace('l',''))
      }
      if(connectableBlockLevels.indexOf(block["level_number"]) < 0) {
        continue;
      }
      data.blocks.push( {
        "Assigned": connectedBlockIds.has(block["block_id"]),
        "ID": block["block_id"],
        "Level" : level,
        "Name": block["block_name"],
        //"Color": block["color"],
       // "Position": d["position"]
      })
    }
  }

  function updateQuestionTableData() {
    data.questions = [];
    let questionIds = new Set();
    if(data.blockId != "") {
      let filteredIds = f_data.question_block_links.filter((d) => d.block_id === data.blockId.toString()).map((d) => d.qs_id)
      if(filteredIds.length > 0) {
        questionIds = new Set(filteredIds)
      }
    }

    for(let question of f_data.questions) {
        let level = question["level_number"];
        if(level != data.blockLevel && level != "general") {
          continue;
        }
        if(level != "dosage" && level != "general") {
          level = parseInt(question["level_number"].replace('l',''))
        }
        data.questions.push( {
          "Assigned": questionIds.has(question["qs_id"]),
          "ID": question["qs_id"],
          "Level" : level.toString(),
          "Question": question["question"],
          "Type": question["qs_type"],
          "Informative": question["qs_feature"] ? false : true
        })
    }
  }

  function updateOptionTableData() {
    let questionId = data.selectedOptions.questionData.ID;
    let questionType = data.selectedOptions.questionData.Type;
    let level = data.selectedOptions.questionData.Level;
    let currOptionsData = []
    let affectedDosageBlocks = []

    let answerConcepts = f_data.answers_concept_definition.filter((d) => d.qs_id === questionId)
    if(answerConcepts.length === 0) {
        if("newQuestionOptions" in f_data) {
            if(questionId in f_data["newQuestionOptions"]) {
                possibleAnswers = f_data["newQuestionOptions"][questionId];
                if(data.blockLevel === "l2") {
                  for(let i = 1; i < 4; i++) {
                      affectedDosageBlocks.push({
                          "dl" : i,
                          "block_id": data.blockId,
                          "possible_answers": possibleAnswers
                      })
                  }
                }
                else {
                  affectedDosageBlocks.push({
                    "block_id": data.blockId,
                    "possible_answers": possibleAnswers
                  })
                }
            }
        }
    }
    else {
        affectedDosageBlocks = answerConcepts[0].affected_dosage_blocks.filter(d => d["block_id"] === data.blockId)
        if(affectedDosageBlocks.length < 1) {
            if(answerConcepts[0].affected_dosage_blocks.length > 0 && answerConcepts[0].affected_dosage_blocks[0].possible_answers.length > 0) {
                let possibleAnswers = JSON.parse(JSON.stringify(answerConcepts[0].affected_dosage_blocks[0].possible_answers));
                possibleAnswers.forEach((n)=> n.validity = "")
                if(data.blockLevel === "l2") {
                  for(let i = 1; i < 4; i++) {
                      affectedDosageBlocks.push({
                          "dl" : i,
                          "block_id": data.blockId,
                          "possible_answers": possibleAnswers
                      })
                  }
                }
                else {
                  affectedDosageBlocks.push({
                    "block_id": data.blockId,
                    "possible_answers": possibleAnswers
                  })
                }
            }
        }

    }
    for(let block of affectedDosageBlocks) {
        for(let option  of block.possible_answers) {
            let row = {
              "Completed": option["validity"] != "" ? true: false,
              "ID": option["option_id"],
              "Value" :option["value"],
              "Validation": option["validity"]
            }
            if(questionType === "range") {
              row["Min"] = parseFloat(option["min"])
              row["Max"] = parseFloat(option["max"])
            }
            if(typeof(block.dl) != "undefined") {
                row["DL"] = block.dl
            }
            currOptionsData.push(row)
        }

    }

    data.selectedOptions["tableData"] = currOptionsData;
  }

  function updateOptionTableData1() {
    let questionId = data.selectedOptions.questionData.ID;
    let questionType = data.selectedOptions.questionData.Type;
    let currOptionsData = []
    let possibleAnswers = []

    let answerConcepts = f_data.answers_concept_definition.filter((d) => d.qs_id === questionId)
    if(answerConcepts.length === 0) {
        if("newQuestionOptions" in f_data) {
            if(questionId in f_data["newQuestionOptions"]) {
                possibleAnswers = f_data["newQuestionOptions"][questionId];
            }
        }
    }
    else {
        let blocksAffected = answerConcepts[0].affected_dosage_blocks.filter(d => d["block_id"] === data.blockId)
        if(blocksAffected.length > 0) {
            possibleAnswers = blocksAffected[0].possible_answers;
        }
        else {
            if(answerConcepts[0].affected_dosage_blocks.length > 0 && answerConcepts[0].affected_dosage_blocks[0].possible_answers.length > 0) {
                possibleAnswers = JSON.parse(JSON.stringify(answerConcepts[0].affected_dosage_blocks[0].possible_answers));
                possibleAnswers.forEach((n)=> n.validity = "")
            }
        }

    }

    for(let option  of possibleAnswers) {
        let row = {
          "Completed": option["validity"] != "" ? true: false,
          "ID": option["option_id"],
          "Value" :option["value"],
          "Validation": option["validity"]
        }
        if(questionType === "range") {
          row["Min"] = parseFloat(option["min"])
          row["Max"] = parseFloat(option["max"])
        }
        currOptionsData.push(row)
    }

    data.selectedOptions["tableData"] = currOptionsData;
  }

  function addNewBlock() {
    //initialize table
    if(blockConnectionsTable)
    blockConnectionsTable = null
    blockQuestionsTable = null
    let blockNameWidth = ($("#newBlockModal .modal-body").width() - 50) * 0.5;
    blockConnectionsTable = new Tabulator("#newBlockConnectionTable", {
        data:data.blocks, //assign data to table
        height:"175px",
        layout:"fitColumns",
        //selectable:true,
        columns:[
          {title:"Assigned", field:"Assigned", sorter:"boolean", vertAlign: "center", hozAlign:"center", headerHozAlign:"center", formatter:"tickCross", width:100},
          {title:"ID", field:"ID", sorter:"number", vertAlign: "center", hozAlign:"center", headerHozAlign:"center"},
          {title:"Level", field:"Level", sorter:"number", vertAlign: "center", hozAlign:"center",  headerHozAlign:"center"},
          {title:"Name", field:"Name", sorter:"string", formatter:"textarea", vertAlign: "center", hozAlign:"left",  headerHozAlign:"center", width:blockNameWidth},
          {title:"Color", field:"Color", formatter:"string", vertAlign: "center", hozAlign:"center",  headerHozAlign:"center"},
        ],
    });

    blockConnectionsTable.on("rowClick", function(e, row){
      let Assigned = row.getData().Assigned;
      row.update({"Assigned": !Assigned}).then(function(){

      })
      .catch(function(error){

      });
    });

    blockConnectionsTable.getRows()
        .filter(row => row.getData().Assigned == true)
        .forEach(row => row.toggleSelect());

    let questionWidth = ($("#newBlockModal .modal-body").width() - 50) * 0.40;
    blockQuestionsTable = new Tabulator("#newBlockQuestionsTable", {
      data:data.questions, //assign data to table
      layout:"fitColumns",
      height:"175px",
      //selectable:true,
      columns:[
        {title:"Assigned", field:"Assigned", sorter:"boolean", vertAlign: "center", hozAlign:"center", headerHozAlign:"center", formatter:"tickCross", width:100},
        {title:"ID", field:"ID", sorter:"number", vertAlign: "center", hozAlign:"center", headerHozAlign:"center"},
        {title:"Level", field:"Level", sorter:"string", vertAlign: "center", hozAlign:"center",  headerHozAlign:"center"},
        {title:"Question", field:"Question", sorter:"string", formatter:"textarea", vertAlign: "center", hozAlign:"left",  headerHozAlign:"center", width:questionWidth},
        {title:"Type", field:"Type", formatter:"string", vertAlign: "center", hozAlign:"center",  headerHozAlign:"center"},
        {title:"Informative", field:"Informative", sorter:"boolean", vertAlign: "center", hozAlign:"center",  headerHozAlign:"center", width:120},
      ]
    });
    blockQuestionsTable.on("rowClick", function(e, row){
        let questionId = row.getData().ID;
        let isRowSelected = blockQuestionsTable.getSelectedRows().some((selectedRow) => selectedRow === row)
        blockQuestionsTable.getSelectedRows().forEach((selectedRow) =>  blockQuestionsTable.deselectRow(selectedRow))
        if(isRowSelected) {
          blockQuestionsTable.deselectRow(row)
          $questionOptionTableContainer.hide()
        }
        else {
          $questionOptionTableContainer.show()
          blockQuestionsTable.selectRow(row)
          data.selectedOptions.questionData = row.getData()
          blockHandler.updateOptionTable(questionId);
        }

        /*let Assigned = row.getData().Assigned;
        row.update({"Assigned": !Assigned}).then(function(){
        })
        .catch(function(error){
        }); */
    });


  }

  function updateBlockQuestionTable() {
    blockHandler.updateBlockTableData()
    blockHandler.updateQuestionTableData()
    blockHandler.addNewBlock()
  }

  function updateOptionTable() {
    let questionType = data.selectedOptions.questionData.Type;
    let level = data.selectedOptions.questionData.Level;
    blockHandler.updateOptionTableData()
    let valueWidth = ($("#newBlockModal .modal-body").width() - 70) * 0.4;

    let columns = [
      {title:"Completed", field:"Completed", sorter:"boolean", vertAlign: "center", hozAlign:"center", headerHozAlign:"center", formatter:"tickCross", width:100},
      {title:"ID", field:"ID", sorter:"string", vertAlign: "center", hozAlign:"center", headerHozAlign:"center", width:60},
      {title:"Value", field:"Value", sorter:"string", formatter:"textarea", vertAlign: "center", hozAlign:"left",  headerHozAlign:"center"},

    ]
    if(questionType === "range") {
      columns.push({title:"Min", field:"Min", sorter:"number", vertAlign: "center", hozAlign:"center", headerHozAlign:"center", width:80})
      columns.push({title:"Max", field:"Max", sorter:"number", vertAlign: "center", hozAlign:"center", headerHozAlign:"center", width:80})
    }

    if(data.selectedOptions.tableData.length > 0 && typeof(data.selectedOptions.tableData[0]["DL"]) != "undefined")  {
        columns.splice(1,0, {title:"DL", field:"DL", sorter:"number", vertAlign: "center", hozAlign:"center", headerHozAlign:"center", width:60})
    }
    columns.push({title:"Validation", field:"Validation", formatter:"string", vertAlign: "center", hozAlign:"center",  headerHozAlign:"center", editor:"list",  width:135, editorParams:{values:{"valid":"Valid", "invalid":"Invalid", "maybe_valid":"MayBeValid"}}})

    optionTable = new Tabulator("#questionOptionTable", {
        data:data.selectedOptions.tableData, //assign data to table
        pagination:"local",
        height:"135px",
        layout:"fitColumns",
        columns:columns
    });

    optionTable.on("tableBuilt", function(){
        blockHandler.checkCompletionQuesOptions()
    });
    optionTable.on("cellEdited", function(cell){
        let completedStatus = cell.getValue() != ""
        cell.getRow().update({"Completed":completedStatus}).then(function(){
            blockHandler.checkCompletionQuesOptions()
            blockHandler.updateGlobalQuesOption();
        })
        .catch(function(error){
        });

    });
  }
  function deleteBlockGlobalData(blockId) {
     // f_data.edges = f_data.edges.filter((edge)=> edge.child != blockId || edge.parent != blockId)
      let associatedQuesIds = new Set(f_data.question_block_links.filter((d) => parseInt(d.block_id) === parseInt(blockId)).map((d) => parseInt(d.qs_id)))
      blockHandler.deleteAssociatedAnswers(associatedQuesIds, blockId);
      f_data.edges = f_data.edges.filter((edge)=> edge.child != blockId && edge.parent != blockId)
      f_data.question_block_links = f_data.question_block_links.filter((link)=> parseInt(link["block_id"]) != parseInt(blockId))
  }

  function updateGlobalBlockData() {
    if(data.originBlockLevel != "" && data.originBlockLevel != data.blockLevel) {
        blockHandler.deleteBlockGlobalData(data.blockId)
    }

    let parentBlockLevel = ""
    let childBlockLevel = ""
    if(data.blockLevel === "l0") {
      childBlockLevel = 1
    }
    else if(data.blockLevel === "l1") {
      parentBlockLevel = 0
      childBlockLevel = 1
    }
    else if(data.blockLevel === "l2") {
      parentBlockLevel = 1
      childBlockLevel = "dosage"
    }
    else if(data.blockLevel === "dosage") {
      parentBlockLevel = 2
    }

    let maxEdgeId = Math.max(...f_data.edges.map( (edge) => parseInt(edge.edge_id))) + 1
    let maxQuesBlockLinkId = Math.max(...f_data.question_block_links.map( (link) => parseInt(link.qb_link_id))) + 1
    if(data.blockPosition =="") {
      data.blockPosition = Math.max(...f_data.blocks
        .filter((block) => block.level_number == data.blockLevel)
        .map( (block) => parseInt(block.position))) + 1

    }

    // update general block data
    //--------------------------------------------------------------------------------
    let blockObj = {
      "block_id": data.blockId,
      "level_number": data.blockLevel,
      "block_name": data.blockName,
      "class": data.blockClass,
      "color": data.blockColor,
      "position": data.blockPosition
    }
    if(data.isNewBlock) {
        f_data.blocks.push(blockObj)
    }
    else {
        f_data.blocks[data.blockIndex] = blockObj;
    }

    // update block connections
    //--------------------------------------------------------------------------------
    let connectedParentsIds = new Set(blockConnectionsTable.getRows()
          .filter(row => row.getData().Level === parentBlockLevel && row.getData().Assigned)
          .map((row)=> parseInt(row.getData().ID)))

    let removedParentsIds = new Set(blockConnectionsTable.getRows()
        .filter(row => row.getData().Level === parentBlockLevel && !row.getData().Assigned)
        .map((row)=> parseInt(row.getData().ID)))

    let connectedChildIds = new Set(blockConnectionsTable.getRows()
          .filter(row => row.getData().Level === childBlockLevel && row.getData().Assigned)
          .map((row)=> parseInt(row.getData().ID)))
    let removedChildIds = new Set(blockConnectionsTable.getRows()
        .filter(row => row.getData().Level === childBlockLevel && !row.getData().Assigned)
        .map((row)=> parseInt(row.getData().ID)))

    f_data.edges = f_data.edges.filter((edge)=> {
        if(edge.child === data.blockId && removedParentsIds.has(edge.parent)) {
          return false;
        }
        else if(edge.parent === data.blockId && removedChildIds.has(edge.child)) {
          return false;
        }
        return true
    })
    let currConnectedParentsIds = f_data.edges.filter((edge) => edge.child===data.blockId && connectedParentsIds.has(edge.parent)).map((edge) => edge.parent)
    let currConnectedChildIds = f_data.edges.filter((edge) => edge.parent===data.blockId && connectedChildIds.has(edge.child)).map((edge) => edge.child)
    connectedParentsIds.forEach((parentId)=> {
        if(currConnectedParentsIds.indexOf(parentId) < 0) {
            maxEdgeId = maxEdgeId + 1
            let edgeId = maxEdgeId.toString()
            f_data.edges.push({
                "edge_id": edgeId,
                "parent": parseInt(parentId),
                "child": parseInt(data.blockId)
            })
          }
    })
    connectedChildIds.forEach((childId)=> {
      if(currConnectedChildIds.indexOf(childId) < 0) {
          maxEdgeId = maxEdgeId + 1
          let edgeId = maxEdgeId.toString()
          f_data.edges.push({
              "edge_id": edgeId,
              "parent": parseInt(data.blockId),
              "child":  parseInt(childId)
          })
        }
    })

    $('#newBlockModal').modal("hide")

    // update question + block links
    //--------------------------------------------------------------------------------
    let assignedQuestionsIds = new Set(blockQuestionsTable.getRows()
        .filter(row => row.getData().Assigned)
        .map((row)=> parseInt(row.getData().ID)))

    let removedQuestionsIds = new Set(blockQuestionsTable.getRows()
        .filter(row => !row.getData().Assigned)
        .map((row)=> parseInt(row.getData().ID)))

    blockHandler.deleteAssociatedAnswers(removedQuestionsIds, data.blockId);

    f_data.question_block_links = f_data.question_block_links = f_data.question_block_links.filter((link)=> {
        if(parseInt(link["block_id"]) === parseInt(data.blockId) && removedQuestionsIds.has(parseInt(link.qs_id))) {
            return false;
        }
        return true
    })
    let currQuestionsIds = f_data.question_block_links.filter((link) => parseInt(link["block_id"]) === parseInt(data.blockId) && assignedQuestionsIds.has(parseInt(link.qs_id))).map((link) => parseInt(link.qs_id))

    assignedQuestionsIds.forEach((quesId) => {
        if(currQuestionsIds.indexOf(quesId) < 0) {
            maxQuesBlockLinkId = maxQuesBlockLinkId + 1
            f_data.question_block_links.push({
              "qb_link_id": maxQuesBlockLinkId.toString(),
              "qs_id": quesId.toString(),
              "block_id": data.blockId.toString()
            })
        }
    })

    //let updatedDataset = JSON.stringify(f_data)
    //Shiny.setInputValue("updatedDataset", updatedDataset);
    answers_object["f_data"] = f_data;
    var send_json = JSON.stringify(answers_object)
    Shiny.setInputValue("send_json", send_json);
 /*   var question_type = find_question_type (quesId)
    console.log(question_type)
    Shiny.onInputChange("js_question_type", question_type);*/
    //Shiny.setInputValue("updatedDataset", updatedDataset);
    $('#newBlockModal').modal("hide")
    redrawGraph(f_data)
    draw_table(data.blockId)




  }

  function checkCreateBtnEnabling() {
    let disabled = data.blockLevel == "" || data.blockName == "" || data.blockClass == ""
    $createBlockBtn.prop('disabled', disabled)
  }

  function subscribeEvents() {

    $newBlockLevelSelection =  $("#levelOfNewBlock");
    $optionAssignBtn = $("#blockOptionAssignBtn");
    $optionDissmissBtn = $("#blockOptionDissmissBtn");
    $optionDisabledBtn = $("#blockOptionDisabledBtn");
    $optionBtnContainers = $(".block-assign-btn")
    $blockInputNameField = $("#blockInputNameField")
    $blockInputClassField = $("#blockInputClassField")
    $blockInputColorField = $("#blockInputColorField")
    $createBlockBtn = $("#blockCreateBtn")
    $blockCancelBtn = $("#blockCancelBtn")
    $questionOptionTableContainer = $("#questionOptionTableContainer")

    $("#createNewBlockBtn").click( () => {
        $('#newBlockModal').modal("show")
        f_data_copy = JSON.parse(JSON.stringify(f_data));
        answers_object_copy = JSON.parse(JSON.stringify(answers_object));
        blockHandler.setEmptyData();
        blockHandler.updateBlockTableData()
        blockHandler.updateQuestionTableData()
        data.blockId = Math.max(...f_data.blocks.map( (block) => parseInt(block.block_id))) + 1
        //data.blockPosition = Math.max(...f_data.blocks.map( (block) => parseInt(block.position))) + 1
        data.isNewBlock = true

        $('#newBlockModal').on('shown.bs.modal', function () {
          blockHandler.addNewBlock()
          blockHandler.checkCreateBtnEnabling();
        })
    })
    $("#editBlockBtn").click( () => {
        let blockId = $("#editBlockBtn").attr("blockId")
        if(typeof(blockId) != "undefined" && blockId != "") {
            blockHandler.editBlock( blockId);
        }
    })

    $("#deleteBlockBtn").click( () => {
        let blockId = $("#editBlockBtn").attr("blockId")
        if(typeof(blockId) != "undefined" && blockId != "") {
            var choice = confirm("Are you sure to delete this the block?");
            if (choice) {
              blockHandler.deleteBlock(blockId)
            }
        }

    })


    $newBlockLevelSelection.on('change', function () {
        let blockLevel =  $('option:selected',this).val();
        data.blockLevel = blockLevel;
        blockHandler.updateBlockQuestionTable()
        blockHandler.checkCreateBtnEnabling();
    });

    $blockInputNameField.on('change keyup paste', function () {
        data.blockName = $(this).val();
        blockHandler.checkCreateBtnEnabling();
    })

    $blockInputClassField.on('change', function () {
        data.blockClass = $(this).val();
        blockHandler.checkCreateBtnEnabling();
    })

    $blockInputColorField.on('change', function () {
        data.blockColor = $(this).val();
        blockHandler.checkCreateBtnEnabling();
    })


    $newBlockLevelSelection.on('change', function () {
        let blockLevel =  $('option:selected',this).val();
        data.blockLevel = blockLevel;
        blockHandler.updateBlockQuestionTable()
    });



    $optionAssignBtn.click(function() {
        blockHandler.assignOrDissmissQuestion(true);
    })

    $optionDissmissBtn.click(function() {
        blockHandler.assignOrDissmissQuestion(false);
    })

    $optionBtnContainers.click(function() {

    })

    $createBlockBtn.click(function() {
        blockHandler.updateGlobalBlockData();
    })

    $blockCancelBtn.click(function() {
        f_data = JSON.parse(JSON.stringify(f_data_copy));
        answers_object = JSON.parse(JSON.stringify(answers_object_copy));
        $('#newBlockModal').modal("hide")
    })

    $optionBtnContainers.hide();
  }

  function assignOrDissmissQuestion(assign) {
    let filtredRows = blockQuestionsTable.getRows().filter(row => row.getData().ID == data.selectedOptions.questionData.ID)
    if(filtredRows.length > 0) {
        let row = filtredRows[0]
        row.update({"Assigned": assign})
            .then(function(){


                /*let answerConceptIndex = f_data.answers_concept_definition.findIndex((d)=> parseInt(d.qs_id) == parseInt(row.getData().ID))
                let affectedBlockIndex = -1;
                if(answerConceptIndex > -1) {
                    let answerConcept = f_data.answers_concept_definition[answerConceptIndex]
                    affectedBlockIndex = answerConcept.affected_dosage_blocks.findIndex((d)=> parseInt(d.block_id) == parseInt(data.blockId))
                }
                if(assign) {
                    let possibleAnswers = []
                    optionTable.getData().forEach((option)=> {
                        let optionObj = {
                            "option_id" : option.ID,
                            "value": option.Value,
                            "validity": option.Validation,
                            "comment": " "
                        }

                        if(typeof(option.Min) != "undefined") {
                          optionObj["min"] = option.Min
                        }
                        if(typeof(option.Max) != "undefined") {
                          optionObj["max"] = option.Max
                        }
                        possibleAnswers.push(optionObj)
                    })

                    if(answerConceptIndex > -1 && affectedBlockIndex > -1) {
                        f_data.answers_concept_definition[answerConceptIndex].affected_dosage_blocks[affectedBlockIndex] = {
                            block_id: data.blockId,
                            possible_answers: possibleAnswers
                        }
                    }
                    else if(answerConceptIndex > -1 && affectedBlockIndex < 0) {
                        f_data.answers_concept_definition[answerConceptIndex].affected_dosage_blocks.push({
                            block_id: data.blockId,
                            possible_answers: possibleAnswers
                        })
                    }
                    else {
                        let affected_dosage_blocks = []
                        affected_dosage_blocks.push({
                            block_id: data.blockId,
                            possible_answers: possibleAnswers
                        })
                        f_data.answers_concept_definition.push({
                            "ac_id": data.selectedOptions.questionId,
                            "qs_id": data.selectedOptions.questionId,
                            "affected_dosage_blocks":affected_dosage_blocks
                        })
                    }
                }
                else {
                  */
                 /*if(!assign) {
                      f_data.answers_concept_definition.forEach((answerConceptObj)=> {
                          if(parseInt(answerConceptObj.qs_id) == parseInt(row.getData().ID)) {
                              answerConceptObj.affected_dosage_blocks = answerConceptObj.affected_dosage_blocks((d)=> parseInt(d.block_id) != parseInt(data.blockId))
                          }
                      })
                 } */

                //}


                data.selectedOptions.questionData.Assigned = assign;
                $optionBtnContainers.hide();
                if(assign) {
                    $optionDissmissBtn.show();
                }
                else {
                    $optionAssignBtn.show();
                }

            })
            .catch(function(error){

            });
    }
  }

  function assignOption(assign) {
      let questionId = data.selectedOptions.questionData.ID
      let answerConceptIndex = f_data.answers_concept_definition.findIndex((d) => d.qs_id === questionId)
      if(answerConceptIndex > -1) {

      }
      else {
          let blockIndex = answerConcepts[answerConceptIndex].affected_dosage_blocks.findIndex(d => d["block_id"] === data.blockId)

          if(blockIndex > -1) {
              if(!assign) {
                  answerConcepts[answerConceptIndex].affected_dosage_blocks.splice(blockIndex, 1)
              }
          }
      }
  }

  function updateGlobalQuesOption() {
    let questionId = data.selectedOptions.questionData.ID
    let questionType = data.selectedOptions.questionData.Type
    let answerConceptIndex = f_data.answers_concept_definition.findIndex((d) => d.qs_id === questionId)
    let possibleAnswers = []
    let DLsPossibleAnswers = {}
    optionTable.getRows().forEach((row) => {
        let answer = {
            "option_id": row.getData().ID,
            "value": row.getData().Value,
            "validity": row.getData().Validation,
            "comment": ""
        }
        if(questionType === "range") {
            answer["min"] = row.getData().Min
            answer["max"] = row.getData().Max

          //  Shiny.onInputChange("js_question_type", questionType);
          //  ranges.push(answer["min"],answer["max"]) ;
          //  Shiny.onInputChange("ranges", ranges);
        }
        if(typeof(row.getData().DL) != "undefined") {
            if(typeof(DLsPossibleAnswers[row.getData().DL]) === "undefined") {
              DLsPossibleAnswers[row.getData().DL] = []
            }
            DLsPossibleAnswers[row.getData().DL].push(answer)
        }
        possibleAnswers.push(answer)
    })

    if(answerConceptIndex < 0) {
        f_data.answers_concept_definition.push({
            "ac_id": questionId.toString(),
            "qs_id": questionId.toString(),
            "affected_dosage_blocks": []
        })
        answerConceptIndex = f_data.answers_concept_definition.length - 1;
    }
    if(Object.keys(DLsPossibleAnswers).length > 0) {
        for(let DL in DLsPossibleAnswers) {
            let blockIndex = f_data.answers_concept_definition[answerConceptIndex].affected_dosage_blocks.findIndex(d => d["block_id"] === data.blockId &&  parseInt(d["dl"]) === parseInt(DL))
            if(blockIndex < 0) {
              f_data.answers_concept_definition[answerConceptIndex].affected_dosage_blocks.push({
                dl: parseInt(DL),
                block_id: data.blockId,
                possible_answers: DLsPossibleAnswers[DL]
              })
            }
            else {
                f_data.answers_concept_definition[answerConceptIndex].affected_dosage_blocks[blockIndex].possible_answers = DLsPossibleAnswers[DL]
            }
        }
      }
      else {
        let blockIndex = f_data.answers_concept_definition[answerConceptIndex].affected_dosage_blocks.findIndex(d => d["block_id"] === data.blockId)
        if(blockIndex < 0) {
            f_data.answers_concept_definition[answerConceptIndex].affected_dosage_blocks.push({
                block_id: data.blockId,
                possible_answers: possibleAnswers
              })
          }
          else {
              f_data.answers_concept_definition[answerConceptIndex].affected_dosage_blocks[blockIndex].possible_answers = possibleAnswers
          }

    }

  }

  function setEmptyData() {
      data = {
          "isDLBlock": false,
          "NumOfDLs": 0,
          "isNewBlock": true,
          "blockIndex": -1,
          "blockId": "",
          "originBlockLevel":"",
          "blockLevel": "l0",
          "blockName": "",
          "blockClass": "",
          "blockColor": "#f7f7f7",
          "blockPosition": "",
          "blocks" : [],
          "questions": [],
          "selectedOptions": {
              "questionData": {},
              "questionId": "",
              "tableData": []
          }
    }

    $blockInputNameField.val("")
    $blockInputClassField.val("")
    $questionOptionTableContainer.hide()

  }

  function checkCompletionQuesOptions() {
    $optionBtnContainers.hide();
    if(!optionTable.getData().every((d)=> d.Completed)) {
      //$optionDisabledBtn.show();
    }
    else {
        let currentQuestionStatus = data.selectedOptions.questionData.Assigned || false;
        if(currentQuestionStatus) {
              $optionDissmissBtn.show();
          }
          else {
              $optionAssignBtn.show();
        }
    }
  }

  function editBlock(blockId) {
      blockHandler.setEmptyData();
      data.isNewBlock = false;
      data.blockIndex = f_data.blocks.findIndex((d) => d.block_id === parseInt(blockId))
      if(data.blockIndex > -1) {
          f_data_copy = JSON.parse(JSON.stringify(f_data));
          answers_object_copy = JSON.parse(JSON.stringify(answers_object));
          let blockObj = f_data.blocks[data.blockIndex]
          data.blockId = blockObj.block_id
          data.blockPosition = blockObj.position
          data.blockClass = blockObj.class
          data.blockName = blockObj.block_name
          data.originBlockLevel = blockObj.level_number
          data.blockLevel = blockObj.level_number
          data.blockColor = blockObj.color

          $newBlockLevelSelection.val(data.blockLevel)
          $blockInputNameField.val(data.blockName);
          $blockInputClassField.val(data.blockClass );
          $blockInputColorField.val(data.blockColor);

          blockHandler.updateBlockTableData()
          blockHandler.updateQuestionTableData()
          $('#newBlockModal').modal("show")
          $('#newBlockModal').on('shown.bs.modal', function () {
              blockHandler.addNewBlock()
          })
      }
  }

  function deleteBlock(blockId) {
      let filteredBlocks = f_data.blocks.filter((d) => parseInt(d.block_id) === parseInt(blockId))

      blockHandler.deleteBlockGlobalData(blockId);
      f_data.answers_concept_definition.forEach((d)=> {
          d.affected_dosage_blocks = d.affected_dosage_blocks
              .filter(effectedBlock => parseInt(effectedBlock.block_id) != parseInt(blockId))
      })
      f_data.blocks = f_data.blocks.filter((block)=> parseInt(block.block_id) != parseInt(blockId))

      if(filteredBlocks.length > 0) {
          let level = filteredBlocks[0].level_number
          let position = 1;
          f_data.blocks.forEach((d) => {
            if(d.level_number == level) {
              d.position = position;
              position = position + 1;
            }
          })
      }

      answers_object["f_data"] = f_data;
      var send_json = JSON.stringify(answers_object)
      Shiny.setInputValue("send_json", send_json);
      redrawGraph(f_data)
      all()

  }

  function deleteAssociatedAnswers(questionIdList, blockId) {
      answers_object.answers.forEach( (answer) => {
          if(questionIdList.has(parseInt(answer.question_id))) {
              let index = answer.block_id.findIndex((id) => parseInt(id) == parseInt(blockId))
              if(index > -1) {
                  answer.block_id.splice(index, 1)
                  answer.block_validity.splice(index, 1)
                  answer.validations.splice(index, 1)
              }
          }
      })
  }

  function setSelectedBlock(blockId) {
      $("#editBlockBtn").attr("blockId", blockId)
      $("#deleteBlockBtn").attr("blockId", blockId)
  }

  return {
    deleteBlockGlobalData,
    checkCreateBtnEnabling,
    updateGlobalBlockData,
    updateGlobalQuesOption,
    initalizeNewBlockModal,
    setEmptyData,
    updateBlockQuestionTable,
    updateOptionTable,
    updateOptionTableData,
    updateBlockTableData,
    updateQuestionTableData,
    addNewBlock,
    checkCompletionQuesOptions,
    assignOrDissmissQuestion,
    subscribeEvents,
    editBlock,
    deleteBlock,
    setSelectedBlock,
    deleteAssociatedAnswers
  }
}

questionHandler.initalizeNewQuestionModal();
blockHandler.initalizeNewBlockModal();
