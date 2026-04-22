#library(jsonlite)
library(shiny)
library(shinyscreenshot)
library(shinyjs)
#library(xlsx)
#library(rJava)
#library(shinyWidgets)
#library(shinyFiles)
#library('xlsx')
#library(DiagrammeR)
#library(shinyforms)
#library(shinyalert)


function(input, output, session){


  # form_modal <- function(){
  #   p("Question: ",
  #     textOutput('question_id', inline = TRUE),
  #     textOutput('question_clicked_temp', inline = TRUE)
  #   )
  # }
 # time_pure <- format(Sys.time(), "%Y-%m-%d %H:%M:%S %Z")
  #time <- as.numeric(Sys.time())
  time <- format(Sys.time(), "%d_%b_%Y-%H_%M")
  
#time <- str(time_pure)
#  print(time)

  observeEvent(input$updatedDataset, {
      #fileConn<-file(paste0('www/files/', values$a, '/', "data.json"), encoding="UTF-8")
      #writeLines(input$updatedDataset, fileConn)
      #close(fileConn)
  })
  
  dataModal <- function() {
    modalDialog(align="center",
                fluidRow(column(6,
                                textInput("json_name", "Create a new project",placeholder = 'Formulation_Project_A'),
                                actionButton(class="modal_button" ,"ok", "Click to Create a New Project")
                               # shinyDirButton('folder', 'Select a folder', 'Please select a folder', FALSE)
                                

                ),
                column(6,
                       fileInput("file1","Upload a project", accept = c('.json'), buttonLabel = "Browse" ),
                       p(textOutput('yes', inline = TRUE)),
                       p(textOutput('loaded_js', inline = TRUE)),
                       
                       conditionalPanel(condition = "output.yes == 'File uploaded'",
                                        textInput("json_name_uploaded", "Modify the project name:",placeholder = 'Formulation_Project_A')
                       ),
                       actionButton(class="modal_button","upload", "Click to Upload Selected Project")
                       
                       
        
                      
                 
                        
             
                     #  output$dir <- renderPrint(dir())
                       #selectInput("default_project", "Select a project",c("project A", "project B", "none"), selected = "none")
                )),
                # fluidRow(column(6,
                # 
                #         actionButton(class="modal_button" ,"ok", "Click to Create a New Project")
                # ),
                # column(6,
                # 
                #        actionButton(class="modal_button","upload", "Click to Upload Selected Project")
                # )
                # 
                # 
                # ),


                title = "Please create a new project or choose an existing one",
                size = c("l"),

                footer = tagList(p("Warning : If you cancel, your project will be saved under the name 'Default' !! "),
                                 # actionButton(class="modal_button","cancel", "Cancel"),
                                 # modalButton("Cancel")
                                 actionButton(class="modal_button","cancel", "Cancel")
                                 #modalButton("Ok")

                )
    )}

  # observeEvent(input$showmodal,{
  #   showModal(dataModal())
  # })
  showModal(dataModal())

  f_data <- jsonlite::read_json("www/javascript/data.json")

  output$d3 <- renderD3({
    r2d3(
      data =f_data,
      script = "www/javascript/jsCode.js"
    )
  })
  #showModal(dataModal())
  #uploadDataStructure <-reactiveValues(); 
  values <- reactiveValues()
  jsFile <- reactiveValues()
  reactive_path <- reactiveValues()
  uploaded_file <- reactiveValues()
  file_path <- reactiveValues()
  #type <-  reactiveValues()
  
 # reactive({
    #volumes = getVolumes()
    # file_listen <- observeEvent(input$folder, {
    #   volumes = getVolumes()
    #   shinyDirChoose(input, 'folder',  roots=volumes)
    #   
    #   print(input$folder)
    # })
    
    
 #    volumes = getVolumes()
 #    shinyDirChoose(input, 'folder',  roots=volumes, session=session)
 #    path1 <- reactive({
 #      print(input$folder.path)
 #      #return(print(parseDirPath(volumes, input$folder)))
 #    })
 #    
 # # }) 
# 
#   dt <- mtcars
#   
#   

  observeEvent(input$file1,{
    output$yes <- renderText({"File uploaded"})
    output$loaded_js <- renderText({input$file1$name})

  })
  

  observeEvent(input$ok, {


    #output$project_name <- renderText({input$json_name})
    default_project_choice <- input$default_project
    project_name <- input$json_name

    if(is.null(input$json_name)){
      project_name <- "Default"
    }

    values$a <- paste0(project_name)
    output$project_name <- renderText({values$a})

    file_path = file.path('www/files', values$a)

    dir.create(file_path, recursive = TRUE)


    reactive_path$a <- paste0(file_path,'/',values$a,".json")
    #write downloads
    fileConn<-file(reactive_path$a, encoding="UTF-8")
    writeLines("received_json", fileConn)
    close(fileConn)

    session$sendCustomMessage("new_proj_created", "yes")
    removeModal()

  })

  
  observeEvent(input$upload, {
    jsFile$js <- jsonlite::read_json(input$file1$datapath)
    values$uploaded_project_name <- sub(".json$","",basename(input$file1$name))
    values$uploaded_project_name <- gsub("\\_.*","",basename(values$uploaded_project_name))
    print(paste0("uploaded_project_name: " ,values$uploaded_project_name))


    # for project name
    if(input$json_name_uploaded == ""){
      values$a <- sub(".json$","temp",basename(input$file1$name))
      values$a <- gsub("\\_.*","",basename(values$a))
    }
    else{
      values$a <- input$json_name_uploaded
    }

    values$a <- paste0(values$a)

    file_path = file.path('www/files/', values$a)

    dir.create(file_path, recursive = TRUE)

    reactive_path$a <- paste0(file_path,'/',values$a,".json")
    ###
    
    #reactive_path$a <- paste0("www/javascript/",values$a,".json")
    output$project_name <- renderText({values$a})

    fileConn<-file(reactive_path$a, encoding="UTF-8")
    writeLines("received_json", fileConn)
    close(fileConn)


    session$sendCustomMessage("file_load", jsFile$js)
    removeModal()
  })


  observeEvent(input$cancel, {

    #values$a <- paste0("Default","_",time)
    values$a <- paste0("Default")
    output$project_name <- renderText({values$a})
    ###
    file_path = file.path('www/files/', values$a)

    dir.create(file_path, recursive = TRUE)

    reactive_path$a <- paste0(file_path,'/',values$a,".json")
    ###

    fileConn<-file(reactive_path$a, encoding="UTF-8")
    writeLines("received_json", fileConn)
    close(fileConn)

    session$sendCustomMessage("new_proj_created", "yes")
    removeModal()
  })




  # txt <- reactive({
  #   req(input$dg_click)
  #   nodeval <- input$dg_click$nodeValues[[1]]
  #   return(paste(nodeval, " is clicked"))
  # })
  output$print <- renderPrint({
    req(txt())
    txt()
  })


  output$selected <- renderText({
    #shiny looks for bar_clicked to activate the function shiny js (setInputValue)
    bar_number <- as.numeric(req(input$bar_clicked))
    if (bar_number > 0) (bar_number)
  })


  observeEvent(input$attach,{
    supportd_extensions <- c("csv", "json", "xls", "xlsx")
    #file <- input$attach
    ext <- tools::file_ext(input$attach$datapath)
 #   print(paste0("extention:  ",ext))
    block_name = input$block_name
    folder = paste0('www/files/', values$a);
    file_name = input$attach$name
    block_file_list <-  list(file_name)

    folder = paste0(folder,"/",block_name)
    if(!file.exists(folder)) {
        dir.create(folder)
    }
    else {
      block_file_list <- list.files(folder) 
      block_file_list <- append(block_file_list, file_name)
      block_file_list <- unique(block_file_list)
    }
    updateSelectInput(session, "filenames",
      choices = block_file_list,
    )

    session$sendCustomMessage(type="documentHasBeenUploaded", message=list(blockName = block_name, fileList = block_file_list))

    file_path = paste0(folder, "/",file_name)
    
    #dir.create("new")
    #print(ext)
    if(ext == "csv"){
      csv_attachment <- read.csv(input$attach$datapath, header = TRUE)
      output$upload1 <- renderText({input$attach$name})

      #file_path = paste0('www/files/', values$a,"/",csv_attachment_name )
      #print(file_path)
      write.csv(csv_attachment, file_path)

    }
    else if(ext == "json"){
      json_attachment <- jsonlite::read_json(input$attach$datapath)
      json_attachment_name <- input$attach$name
      output$upload1 <- renderText({input$attach$name})
     # output$upload2 <- renderText({input$attach$name})
     # print(json_attachment_name)
    #  print(json_attachment)
#search how to load a json and print it in Rshiny 
      #file_path = paste0('www/files/', values$a,"/",json_attachment_name )
     # fileConn_2<-file(file_path, encoding="UTF-8")
      writeLines(as.character(json_attachment), file_path, useBytes = T)
      
     # close(fileConn_2)

      #----save---


    }
    else if(ext == "xls"| ext == "xlsx"){
    #  excel_attachment <- read.table(input$attach$datapath, header = TRUE)
      excel_attachment_name <- input$attach$name
      output$upload1 <- renderText({input$attach$name})
      file.copy(input$attach$datapath,file_path, overwrite = T)
    #  output$upload3 <- renderText({input$attach$name})
     # print(excel_attachment_name)

      #----save---

      # file_path <- paste("www/javascript/",excel_attachment_name)
      # fileConn_3<-file(file_path, encoding="UTF-8")
     #  write.xlsx(excel_attachment, file_path)
      #            col.names = TRUE, row.names = TRUE, append = TRUE)
      # close(fileConn_3)

      #----save---

    }
    else if(ext == "pdf"){
      file.copy(input$attach$datapath,file_path, overwrite = T)
      output$upload1 <- renderText({input$attach$name})
    }
    else{
      file.copy(input$attach$datapath,file_path, overwrite = T)
      output$upload1 <- renderText({input$attach$name})      
    }
    

  })


  observeEvent(input$manual_block, {
    
    #print(input$manual_block)
    for(block in input$manual_block) {
      	
    
      values$uploaded_project_name <- gsub("\\_.*","",basename(values$uploaded_project_name))
  # 
      new_file_path_to_copy_prevFiles = file.path('www/files/', values$a,'/', block, '/')
      dir.create(new_file_path_to_copy_prevFiles, recursive = TRUE)
  
      #read list of existing files
  
      folder <- paste0('www/files/', values$uploaded_project_name, '/', block, collapse = NULL)
      file_list <- list.files(path=folder)
      print(paste0(file_list))
      #previous file to cpy
      prev_myfile <- paste0('www/files/', values$uploaded_project_name, '/', block, '/',file_list, collapse = NULL)
      file.copy(prev_myfile, new_file_path_to_copy_prevFiles)
    }

  })


  observe({
    #checkme
    output$downloadData <- downloadHandler(

      filename = function() {

        paste0(input$filenames, sep='')

      },
      content = function(file) {
       # myfile <- paste0('www/files/', values$a, '/', input$block_name, '/',input$filenames, collapse = NULL)
        myfile <- paste0('www/files/', values$uploaded_project_name, '/', input$block_name, '/',input$filenames, collapse = NULL)
        print(paste0("previous project path (download from) ", myfile))
        file.copy(myfile, file)
        
        
        #create a similar folder to the uploaded project and download attached items into that folder
        
        #existing files
       #  
       #  file_path = file.path('www/files/', values$a,'/', input$block_name, '/')
       #  print(paste0("new project name: ", values$a , " new project path (going to save here too): ", file_path ))
       #  
       #  
       #  
       #   dir.create(file_path, recursive = TRUE)
       # #  
       #  # reactive_path$a <- paste0(file_path,'/',values$a,".json")
       #   file.copy(myfile, file_path)
      }
    )

  } )

  # set the type of input
  ranges<<- "null"
  #question_type <<- "default"
  #output$question_type <-renderText({question_type})
  # observeEvent(input$change_qs_type,{
  #   
  #   question_type <<- input$js_question_type
  #   #should update the question type on question click
  # #  output$question_type <- renderText({question_type})
  #   print(paste0("just received from js: ", question_type))
  # })
  # 

  
  # value <- reactiveValues(question_type = "default")
  # 
  # output$text <- renderText({
  #   value$question_type
  # })
  # 
  # question_type2 <- reactiveVal("option")
  # observe({
  #   
  #   question_type2 <<-paste0(input$js_question_type)
  # #  output$question_type2 <- renderText({question_type2})
  #   
  # })
  # 
  
  
  question_type_listen <- reactive({
    list(input$question_clicked,input$js_question_type)
  })
  
  qs_output <- reactiveValues()
  
  observeEvent(question_type_listen(), {
   
    question_type <<-paste0(input$js_question_type)
    qs_output <- question_type
    output$question_type <- renderText({qs_output})
    
    

    
   # question_type <<- input$js_question_type
   #value$question_type <- renderText({question_type})
  # output$question_type <- renderText({question_type})
  # print(paste0("just received from js: ", qs_output))
   
    #value$question_type <- renderText({input$js_question_type})
  })
  
# 
#   observeEvent(question_type_listen(), {
# 
#     question_type <<- input$js_question_type
#     output$question_type <- renderText({question_type})
#     print(paste0("just received from js: ", question_type))
#   })

  type_listen <- reactive({
    #list(input$inSelect, input$d_loading)
   # list( input$js_question_type, input$question_clicked, input$ranges)
    list(input$question_clicked)
   # list( input$question_clicked)
    
  })
  observeEvent(type_listen(),  {
    #remove previous variables
    ranges <<- ""
    question_type <<- ""
    #comment <<- NULL
    ans_input<<- ""
    
    output$ranges <- renderText("")
    
    
   # question_type <<- input$js_question_type
    #should update the question type on question click
    #output$question_type <- renderText({question_type})
    ranges <<- input$ranges
    selected_ans <- input$inSelect
    comment <- input$answer_validation3
    ans_input <- input$answer_input
    x <- input$answer_options
    selected_answer_option <- input$prev_answer

    if (is.null(x))
      x <- character(0)
    if (is.null(selected_answer_option)){
      selected_answer_option <- 'null_blank'
    }
    
    
    updateSelectInput(session, "inSelect",
                      label = paste0("Options"),
                      choices = x,
                      selected = selected_answer_option
    )

    if (is.null(comment))
    { comment <- "no comment" }
    if (is.null(comment))
    { comment <- "no comment" }
    
    output$ranges <- renderText({paste("*", ranges)})
    updateTextInput(session, "validation3", value = comment )
    updateNumericInput(session , "input_range", value = ans_input)
    # output$ranges <- renderText({
    #   input$ranges
    #   
    # })
    # 

    prev_answer <- "select"
    
    
    
    
    # print({input$js_question_type})
    # print(ans_input)
    # print(ranges)
    # print(x)
    # print("******************")
    
   # print(typeof(input$ranges))
    #output$ranges <- renderText({ranges})

    
        })

  answer_options_listen <- reactive({
    list(input$remove_options)
  })

  observeEvent(answer_options_listen(),{


    x <- input$answer_options
    

    updateSelectInput(session, "inSelect",
                      label = paste0("Options"),
                      choices = x,
                      selected = ""
    )
    updateTextInput(session, "validation3",
                    label = "Comment",
                    value = "")

    #output$question_type <- renderText({input$js_question_type})

   
  })

  answer_input_listen <- reactive({
    list(input$remove_input)
  })

  observeEvent(answer_input_listen(),{

    updateNumericInput(session, "input_range",
                      label = "Answer",
                      value = ""
    )
    updateTextInput(session, "validation3",
                    label = "Comment",
                    value = "")
  })


# observe({
#   y <- input$answer_range
#   updateNumericInput(session, "input_range",
#                      label = "Answer",
#                      value = ""
#   )
#   updateTextInput(session, "validation3",
#                   label = "Comment",
#                   value = "")
#
# })
# observe({
# 
#   #  x <- "emp"
#   x <- input$answer_options
#   selected_answer_option <- input$prev_answer
#   print({input$js_question_type})
#   # print(x)
#   # print("******************")
# 
#   if (is.null(x))
#     x <- character(0)
#   if (is.null(selected_answer_option)){
#     selected_answer_option <- 'null_blank'
#   }
# 
#   updateSelectInput(session, "inSelect",
#                     label = paste0("Options"),
#                     choices = x,
#                     selected = selected_answer_option
#   )
#   prev_answer <- "select"
# 
# })

# gets the validation of a given answer from javascript
  observe({

    selected_ans <- input$inSelect
    x <- input$answer_validation1
    updateTextInput(session, "validation1", value = x )

    #session$sendCustomMessage("validation_change", x)
  })

  # observe({
  #   selected_ans <- input$inSelect
  #   dos <- input$dosage_validation
  #   #print(dos)
  #   updateTextInput(session, "dosage", value = dos )
  # })

  observe({

    selected_ans <- input$inSelect
    comment <- input$answer_validation3
    ans_input <- input$answer_input
    #data_input <- input$answer_input
    if (is.null(comment))
    { comment <- "no comment" }

    updateTextInput(session, "validation3", value = comment )
    updateNumericInput(session , "input_range", value = ans_input)
  })


  # output$validation4 <- renderText({
  #   input$answer_validation4
  # })

  # observe({
  #   strength_update <- input$strength_update
  #   updateTextInput(session, "strength", value = 0 )
  # })

  # changes_list <- reactive({
  #   list(input$inSelect, input$input_range)
  # })
  #

#
#   observeEvent(changes_list(),{
#
#     updateTextInput(session, "validation1", value = 'null' )
#
#     if(length(input$inSelect)!= 0){
#       send_result <- input$inSelect
#       session$sendCustomMessage("ans", send_result)
#       session$sendCustomMessage("inselect_change", send_result)
#     }
#     else if(length(input$input_range) != 0){
#       send_result <- input$input_range
#       session$sendCustomMessage("ans", send_result)
#       session$sendCustomMessage("inselect_change",send_result)
#     }
#
#     print(input$inSelect)
#     print(input$input_range)
#   })
#




  # result_change <- function() {
  #   changed_ans <- input$inSelect
  # }
  # range_change <- function(){
  #   changed_ans <- input$input_range
  # }
  result_change <- function() {
    changed_ans <- input$inSelect
  }
  range_change <- function(){
    changed_ans <- input$input_range
  }

  observe({
    # sends a message to js in case of change in ui

    session$sendCustomMessage("ans", result_change())
    updateTextInput(session, "validation1", value = 'null' )
  })
  observe({
    # sends a message to js in case of change in ui
    updateTextInput(session, "validation1", value = 'null' )
    session$sendCustomMessage("ans", range_change())

  })
  updateTextInput(session, "validation1", value = 'null' )

  observe({
    updateTextInput(session, "validation1", value = 'null' )
    session$sendCustomMessage("inselect_change", result_change())
    #print(input$validation1)

  })
  observe({
    updateTextInput(session, "validation1", value = 'null' )
    session$sendCustomMessage("inselect_change", range_change())
    #print(input$validation1)

  })

observeEvent(input$screenshot,{
  screenshot(id = "block_1")
})

  change_listen <- reactive({
    list(input$get_form_answer)
  })

  observeEvent(change_listen(),{

    updateSelectInput(session, "inSelect",
                     # label = paste0("Select your answer"),
                      choices = "select",
                      selected = "select"
    )
    # updateTextInput(session, "validation3",
    #                 label = "Comment",
    #                 value = "")
    # updateNumericInput(session, "input_range",
    #                    label = "Answer",
    #                    value = ""
    # )



  })

#d_loading should be verified through json and user shouldn't select the dl, should only be able to see the changes of dl
  dl_change <- function(){

    new_dl <- input$d_loading

  }


  dl_listen <- reactive({
    #list(input$inSelect, input$d_loading)
    list(input$d_loading)
    })
  observeEvent(dl_listen(),{
   # session$sendCustomMessage("inselect_change", result_change())
    new_dl <- input$d_loading
    session$sendCustomMessage("dl_change",dl_change())
   # print(new_dl)
    #print(dl_change)
  })


  toUpdate <- reactive({
    list(input$inSelect)
  })

  observeEvent(toUpdate(),
               {

                 updateNumericInput(session, "drug_loading", value = '' )
                 updateTextInput(session, "strength", value = '')
                 updateTextInput(session, "concentration", value = '')
                 updateTextInput(session, "density", value = '')

               }
               )


  toListen <- reactive({
    list(input$strength,input$concentration, input$density, input$api, input$excipient, input$drug_loading)
  })


  observeEvent(toListen(), {


    #print(input$api)
    if(!isTruthy(input$inSelect)){
      print("please fill out all the necessary inputs")
      return()
    }
    else{
      str <- input$strength
      concentration <- input$concentration
      api <- ((str*100) / concentration)
   #   api <- format(round(api, 2), nsmall = 2)

      #print(api)
      #api <- input$api
      density <- input$density


      c3 <- 0 #lookup table
      if(input$inSelect == "Adult"){
        c3 <- 0.91 #lookup table
      }
      else if(input$inSelect == "Elderly"){
        c3 <- 0.68 #lookup table
      }
      else if(input$inSelect == "Disphagy"){
        c3 <- 0.5 #lookup table
      }
      else if(input$inSelect == "Children"){
        c3 <- 0.37 #lookup table
      }
      loading <- ((api / density /1000)/c3)*100
      # print(input$inSelect)
      excipient <- (1-(loading/100))*c3*1000*0.5
      #excipient <- format(round(excipient, 3), nsmall = 3)
    #  str <- input$strength
      #dr <- input$density
      dr <- input$strength
      updateTextInput(session, "strength", paste("Dosage strength: ",str, "mg"))
      updateTextInput(session, "concentration", paste("APIconcentration",concentration, "%"))
      updateTextInput(session, "density", paste("API density: ",format(density, digits = 3), "g/ml"))
      updateTextInput(session, "api", paste("API amount:",value = format(api, digits = 3), "%"))
      updateNumericInput(session, "api", value = format(api, digits = 3) )
      updateTextInput(session, "drug_loading", paste("Drug loading:",format(loading, digits = 3), "%"))
      #output$drug_loading1 <- renderText({format(loading, digits = 3)})
      updateNumericInput(session, "drug_loading", value = format(loading, digits = 3) )
      updateNumericInput(session, "d_loading", value = format(loading, digits = 3) )
      updateTextInput(session, "excipient", paste("Excipient: ",format(excipient, digits = 3), "mg"))
      updateNumericInput(session, "excipient", value = format(excipient, digits = 3))

      #print(typeof(loading))
      if(typeof(input$drug_loading) == "double"){

        if(input$drug_loading >= 100){
          updateTextInput(session, "validation1", value = "invalid" )
        }
        else if(input$drug_loading < 100 && input$drug_loading >= 80){
          updateTextInput(session, "validation1", value = "maybe_valid" )

        }
        else if(input$drug_loading < 80){
          updateTextInput(session, "validation1", value = "valid" )

        }

      }
      else{
        updateTextInput(session, "validation1", value = "fill" )
        #print("no")
      }

    }



  })


  #output$api <- renderText({input$strength})


  node_change <- function() {
    changed_ans <- input$related_node
    #print(changed_ans)
  }
  
  observe({
    session$sendCustomMessage("changed_node", node_change())
    

  })

  question_change <- function() {
    changed_qs <- input$question_clicked_temp
  }
  observe({
    session$sendCustomMessage("changed_qs", question_change())


  })


  load_change <- function(){
    load_changed <- input$load
  }
  observe({
    session$sendCustomMessage("load_changed", load_change())
  })


  output$question_clicked <- renderText({
    input$question_clicked
  })


  #output$answer_options <- renderUI({input$answer_options})

  output$question_clicked_temp <- renderText({
    input$question_clicked_temp
  })

  qs_id<- renderText({
    input$question_id
  })
  #updateTextInput(session, "question_id", value = qs_id)
  # observeEvent(input$question_id,{
  #   showModal(form_modal())
  # })
  output$question_id <- renderText({
    input$question_id

  })
  output$related_node <- renderText({
    input$related_node
  })
  
  observeEvent(input$block_name,{
    #output$doSomethingElse = renderUI(selectInput("doSomethingElse", "This is a selectbox whose value I'm changing", choices = c("choice1","choice2","choice3","newchoice"), selected = "newchoice", multiple = FALSE))
    output$block_name <- renderText({ input$block_name })
    if(!is.null(input$send_json)) {
      convertedData <- jsonlite::fromJSON(input$send_json)
      if(!is.null(convertedData$uploads[[input$block_name]])) {
          filelist = convertedData$uploads[[input$block_name]]
          updateSelectInput(session, "filenames", choices = filelist)
      }
      else {
        output$upload1 <- renderText("")
        updateSelectInput(session, "filenames", choices = "")
        session$sendCustomMessage(type="documentUploadUpdate", message="")
      }
    }

  })
  

  #output$block_name <- renderText({ input$block_name })


  # shows what is typed in the text input, under it ( verbatim... )
  # output$answer_value <- renderText({
  #   input$question_answer
  # })


  observeEvent(input$get_form_answer, {
    json_name <- input$project_name
    # print(input$project_name)
    received_json <- input$send_json
    # print(received_json)
    if(is.null(values$a)){
      values$a <- "temp_name"
    }

    fileConn<-file(reactive_path$a, encoding="UTF-8")
    writeLines(received_json, fileConn)
    close(fileConn)

    updateSelectInput(session, "inSelect",
                      label = paste0("Select your answer"),
                      choices = "new selection",
                      selected = "new selection"
    )
    updateTextInput(session, "validation1", value = '' )
   # updateTextInput(session, "dosage", value = '' )
    updateTextInput(session, "strength", value = '' )

    #print(isolate(values$a));
    #print(received_json)
  })

  # observeEvent(input$save_block_info,{
  #   
  # 
  #   received_blocks_object <- input$send_blocks_object
  #   print(received_blocks_object)
  #   #print(received_blocks_object)
  #   file_name <- paste0(values$a,'_blocks')
  # 
  #   file_path = paste0('www/files/', values$a,'/',file_name,".json" )
  # 
  #   fileConn_1<-file(file_path, encoding="UTF-8")
  #   writeLines(received_blocks_object, fileConn_1)
  #   close(fileConn_1)
  # })

  
  observe({
    #checkme
    output$save_block_info <- downloadHandler(
      
      
      filename = function(){
        paste0(values$a,'_blocks', ".json")
      },
      
      content = function(file) {
        
        data <- input$send_blocks_object
        writeLines(data, file)
        # file.copy(data, file)
      }
    )
    
  } )
  
  
  
  
  
  observe({
    #checkme
    output$downloadData1 <- downloadHandler(
      
    
       filename = function(){
        paste0(values$a, ".json")
      },
      
      content = function(file) {

        data <- input$send_json
        writeLines(data, file, useBytes = T)
       # file.copy(data, file)
      }
    )
    
  } )


  useShinyjs()
  # Create a reactive value to store the authentication status
  # is_authenticated <- reactiveVal(FALSE)
  # updateActionButton(session, "button1", shiny.action = NULL)
  # updateActionButton(session, "button2", shiny.action = NULL)
  # updateActionButton(session, "button3", shiny.action = NULL)
  
  # Define the correct username and password for admin user
  admin_username <- "admin"
  admin_password <- "1234"
  
  # Create a function to check if the user is an admin
  is_admin <- function(username, password) {
    if (username == admin_username && password == admin_password) {
      return(TRUE)
    } else {
      return(FALSE)
    }
  }
  
  
  
  # Show the modal dialog when the login button is clicked
  observeEvent(input$login, {
    showModal(
      modalDialog(align="center",
        title = "Login",
        textInput("username", "Enter your username:"),
        textInput("password", "Enter your password:"),
        footer = tagList(
          actionButton("login_submit", "Submit"),
          actionButton("login_cancel", "Cancel")
        )
      )
    )
  })
  # Observe the reactive value and toggle the state of the buttons
  # observe({
  #   shinyjs::toggleState("button1", is_authenticated())
  #   shinyjs::toggleState("button2", is_authenticated())
  #   shinyjs::toggleState("button3", is_authenticated())
  # })
  # Hide the modal dialog when the cancel button is clicked
  observeEvent(input$login_cancel, {
    removeModal()
  })

  # Check if the user is an admin when the submit button is clicked
  observeEvent(input$login_submit, {
    if (is_admin(input$username, input$password)) {
      print("username and password is correct")
      # Enable the buttons by sending a message to js
      session$sendCustomMessage("toggle_btn_state", "enable")
      # is_authenticated(TRUE)
      # shinyjs::enable("button1")
      # shinyjs::enable("button2")
      # shinyjs::enable("button3")
      # updateActionButton(session, "button1", disabled = FALSE)
      # updateActionButton(session, "button2", disabled = FALSE)
      # updateActionButton(session, "button3", disabled = FALSE)
      removeModal()
    } else {
      showModal(modalDialog(
        title = "Error",
        "Invalid username or password. Please try again.",
        easyClose = TRUE,
        footer = NULL
      ))
    }
  })

  # observeEvent(input$save_project,{
  # 
  #   answers_file <- input$send_json
  #   
  #   file_name <- paste0(values$a,time)
  # 
  #   file_path = paste0('www/files/', values$a,'/',file_name,".json" )
  # 
  #   fileConn_1<-file(file_path, encoding="UTF-8")
  #   writeLines(answers_file, fileConn_1)
  #   close(fileConn_1)
  # })

 

    # volumes = getVolumes()
    # observeEvent(input$Btn_GetFile,{  
    #   if(!is.null(input$folder)){
    #     shinyDirChoose(input, 'folder', roots=volumes)
    #     dir <- reactive(input$folder)
    #     output$dir <- renderText(as.character(dir()))
    #   }
    # })
    # 
    # observeEvent(input$folder,{  
    #   if(!is.null(input$folder)){
    #     shinyDirChoose(input, 'folder', roots=volumes)
    #     output$dir <- renderText(as.character(input$folder))
    #   }
    # })
    # 
    # 
    # shinyDirChoose(input, 'dir', roots = c(name=getwd()))
    # dir <- reactive(input$dir)
    # output$dir <- renderPrint(dir())
  
  
}

