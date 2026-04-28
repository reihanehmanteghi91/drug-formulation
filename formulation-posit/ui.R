library(shiny)
#library(shinyjs)
library(r2d3)
library(shinyscreenshot)
#library(ggplot2)
#library(RJSONIO)
#library(jsonlite)
#library(rjson)
#library(DiagrammeR)
#library(magrittr)
#library(shinyCyJS)
#library(shinyforms)
# library(shinyWidgets)

#library(shinythemes)

fluidPage(id="fluid",
         # useShinyjs(),
          #useShinyalert(),

          tags$head(
            includeCSS("www/css/css.css"),
          #  tags$script(src = "https://unpkg.com/d3-dag@0.6.0"),
            tags$script(src = "javascript/dagre-d3.js"),
            includeCSS("www/css/tabulator.min.css"),
           # tags$script(src = "www/javascript/jquery.js"),
            tags$script(src = "https://cdnjs.cloudflare.com/ajax/libs/d3/7.2.0/d3.min.js"),
            tags$script(src = "https://cdnjs.cloudflare.com/ajax/libs/tabulator/5.4.2/js/tabulator.min.js"),
            tags$script(src = "javascript/jsCode.js"),
            tags$script(src = "javascript/jsCode1.js"),
            tags$style(".modal-body{ min-height:350px}"),
            tags$style(".modal-body {padding: 5px}
                     .modal-content  {-webkit-border-radius: 6px !important;-moz-border-radius: 6px !important;border-radius: 6px !important;}
                     .modal-dialog { width: 900px; display: inline-block; text-Remove: center; vertical-align: center;}
                     .modal-header {background-color: #eae7dc; border-top-left-radius: 6px; border-top-right-radius: 6px; text-align: center;}
                     .modal-footer {background-color: #eae7dc; border-top-left-radius: 6px; border-top-right-radius: 6px; text-align: center;}
                     .modal { text-align: center; padding-right:10px; padding-top: 60px;}
                     .close { font-size: 16px}")
          #tags$script(src = "https://cdn.jsdelivr.net/npm/html2canvas@1.0.0-rc.5/dist/html2canvas.min.js"),

          ),
         
         # div(id = "phase_title", class = "phase_title",tags$svg(class= "")),
          # actionButton("showmodal", "New Project"),
          #actionButton("showForm", "Form"),
          #navbarPage(

         # fluidRow(p(class = "small_title", "Project:" ,textOutput('project_name', inline = TRUE)),
         # 
         #          align="center"),

         # conditionalPanel(condition = "input.login == 1",
         #                  modalDialog(
         #                    title = "Login",
         #                    textInput("username", "Enter your username:"),
         #                    textInput("password", "Enter your password:"),
         #                    footer = tagList(
         #                      actionButton("login_submit", "Submit"),
         #                      actionButton("login_cancel", "Cancel")
         #                    )
         #                  )
         #  ),
            # verbatimTextOutput("project_name"),
            #tabPanel("Project",
                    # useShinyjs(),

                     fillPage(
                       column(3,
                              #p(class = "small_title","Questions and Block Info",align="center"),

                              wellPanel(class="block_panel",div(
                                        #column(3,p("Block Name: "))
                                        #,
                                        column(9,p(class="text_3", textOutput('block_name', inline = TRUE)) )
                                        ,
                                        column(3, actionButton(class="new-question-btn", "modification", "Block", title = "Select a block to activate the manual block validation", icon = icon("pen-to-square"), disabled= TRUE)),
                                       # column(3, actionButton("modification", "", icon = icon("info"))),
                             ) ),

                              wellPanel(id="toggle_block_info",  div(
                                        selectInput("block_validity", "Manual Block Validation",c("Valid", "Invalid", "Maybe Valid")),
                                        textAreaInput("caption", "Comment", "Block Summary"),
                                        fileInput("attach","Attach", multiple = FALSE ,
                                                  accept = c('.csv','.xlsx','.xlx','.json','.pdf'),
                                                  buttonLabel = "Browse...",
                                                  placeholder = "No file selected"
                                                     ),

                                        fluidRow(

                                          column(6,selectInput("filenames", "Download a document", choices ="") ),
                                          column(6,

                                                 fluidRow(p(". ")),
                                                 fluidRow(downloadButton(class="form_button_cancel","downloadData", "Download", icon = icon("file-download")) ))


                                        ),




                                        textOutput('upload1', inline = TRUE),
                                        #textOutput('upload2', inline = TRUE),textOutput('upload3', inline = TRUE),
                                        # # option to show header
                                        # checkboxInput("header", "Header", TRUE),
                                        # #shows content
                                        # tableOutput("contents"),

                                        #actionButton(class="form_button_save","save_block_info", "Save", icon = icon("save")),
                                        actionButton(class="form_button_save","save_block_info", "Save"),

                                        actionButton(class="form_button_cancel","close_block_info", "", icon = icon("xmark"))
                                        ) ),



                              wellPanel(id="toggle"),
                                        div(id="element",class="form",
                                          #p("Question: ",
                                            textOutput('question_id', inline = TRUE),
                                            textOutput('question_clicked_temp', inline = TRUE),
                                          p(textOutput('question_type', inline = TRUE),style ="display: block;"),
                                        #  textOutput("text"),

                                         # ),

                                          p(id="selected_block_toggle",
                                            #"Selected Block: ",
                                            textOutput('related_node', inline = TRUE)),
                                         # p("All related blocks: ", textOutput('validation4', inline = TRUE)),




                                         fluidRow(id="toggle1",class="questionRow",



                                                                 # textOutput('drug_loading1', inline = TRUE),

                                           # column(4, numericInput("loading", "Drug Loading", "")),

                                           column(7,
                                                
                                                  #should update the question type on question click
                                                  conditionalPanel(condition = "input.question_type_direct == 'option'",
                                                  selectInput("inSelect", "Select inputs",c("Item A", "Item B", "Item C")),

                                                                   ),
                                                  conditionalPanel(condition = "input.question_type_direct == 'range'",
                                                  numericInput("input_range", "Answer", ""),
                                                  # show valid ranges here
                                                  )

                                                  ),

                                           column(3,

                                                 conditionalPanel(condition = "input.question_type_direct == 'range'",
                                                                  p(textOutput('ranges', inline = TRUE))
                                                                  )
                                                  )
                                         ),

                                         fluidRow(

                                         div(id="comment_toggle",
                                                  column(7, textInput("validation3", "Comment", "val", width = '100%'))
                                             ),
                                         ),


                                         conditionalPanel(condition = "output.question_type == 'option'",
                                                          actionLink("remove_options", "Remove answer"),

                                         ),
                                         conditionalPanel(condition = "output.question_type == 'range'",
                                                          actionLink("remove_input", "Remove answer")
                                                          # show valid ranges here
                                         )
                                         # conditionalPanel(condition = "output.question_type == 'informative'",
                                         #                  actionLink("remove_informative", "Remove answer")
                                         #                  # show valid ranges here
                                         # )

                                         ,

                                         div(id="loading",
                                             numericInput("strength", "Dosage strength", ""),
                                             numericInput("concentration", "API concentration", ""),
                                             numericInput("density", "API density", ""),
                                             numericInput("api", "API amount", ""),
                                             numericInput("drug_loading", "Drug loading", ""),
                                             numericInput("excipient", "Excipient amount", "")

                                         ),

                                         fluidRow(
                                                      id="validation_toggle",
                                                      column(6,textInput("validation1", "Validation", "") ),

                                         ),
                                         column(6, actionButton(class="form_button_save","get_form_answer", "Save",  icon = icon("save"))),
                                         column(6, actionButton(class="form_button_cancel","close_form", "", icon = icon("xmark")))



                                      ),
                             # ),
                            # wellPanel(div(id="element", selectInput("inSelect", "Select inputs",c("Item A", "Item B", "Item C")))

                            #   ),

                              wellPanel(class ="question_table_wellPanel",
                                        # div(id = "questions"
                                        #     #svg is used for level buttons
                                        #     #tags$svg(class= "")
                                        # ),
                                        actionButton(class="modification-btn", "all_questions", "", title= "All questions", icon = icon("globe")),
                                        actionButton(class="modification-btn", "general_questions", "", title= "General question" , icon = icon("g")),
                                        actionButton(class="modification-btn", "informative_questions", "", title = "Informative question (doesn't affect block validation)", icon = icon("info")),
                                        
                                      #  actionLink("all_questions", "All Questions", class="link"),actionLink("general_questions", "General Questions", class="link"),actionLink("informative_questions", "Informative Questions", class="link"),
                                        actionButton(class="new-question-btn", inputId="createNewQuestionBtn", "new Question", title = "Log in to activate the button", icon = icon("plus"), disabled= TRUE),
                                        div(class="table-responsive",
                                          div(id="table",

                                                # tags$p()
                                          )
                                        )

                              ))
                       ,

                       column(9,




                              #fluidRow(p(class = "small_title", "Project:" ,textOutput('project_name', inline = TRUE)),align="center"),

                             # p(class = "small_title","Matrix",Remove="center"),


                              wellPanel(class="top_wellpanel",
                             #   fluidRow(
                                  # actionGroupButtons(
                                  #   inputIds = c("mode_1", "mode_2", "btn3"),
                                  #   labels = list("Default Mode", "Selection Mode", tags$span(icon("save"), "Action 3")),
                                  #   status = "primary"
                                  # ),

               
                                 div(class="block-btn-container",
                                     actionButton(class="mode_buttons","mode_1", "Default Mode"),
                                     actionButton(class="mode_buttons","mode_2", "Selection Mode" , title= "Select a desired path")
                                 ),
                                 
                                  #actionButton(class="restart","restart", "Clear Matrix"),
                                  #actionButton(class="mode_buttons","save_project", "Save Project"),
      
                                  div(class="block-btn-container",
                                      actionButton(class="new-question-btn", inputId="createNewBlockBtn", "New Block", title = "Log in to activate the button", icon = icon("plus"), disabled = TRUE),
                                      actionButton(class="new-question-btn", inputId="editBlockBtn", "Edit Block", title = "Log in to activate the button", icon = icon("edit"), disabled = TRUE),
                                      actionButton(class="new-question-btn", inputId="deleteBlockBtn", "Delete Block", title = "Log in to activate the button", icon = icon("trash"), disabled = TRUE)
                                  ),
                                  div(class = "block-btn-container",
                                      
                                      actionButton(class="modification-btn", "login", "Log In", title= "Log in to modify the structure (Admin access only)" , icon = icon("user")),
                                       downloadButton(class="modification-btn","downloadData1", "Download", title= "Download your project" ,icon = icon("download")),
                                       actionButton(class="modification-btn","screenshot", "Screenshot",title="Take a screenshot from the graph" ,icon = icon("image"))
                                       
                                   ),
                             
                                  div(class = "block-btn-container",
                                      
                                      p(class = "small_title", "" , title = "Project name",textOutput('project_name', inline = TRUE)),
                                      
                                      )
                           
                                   
                                  #screenshotButton(selector = "#block_1", label = "Capture the Matrix", id= "screenshot")

                               #   downloadLink("downloadData", "project location")



                             # shinyFilesButton("Btn_GetFile", "Choose a file" ,
                             #                  title = "Please select a file:", multiple = FALSE,
                             #                  buttonType = "default", class = NULL),
                             # shinyDirButton('folder', 'Folder select', 'Please select a folder', FALSE),
                             #
                             # textOutput("txt_file")

                                  ####
                                  # column(9,
                                  #        column(2,actionButton(class="mode_buttons","mode_1", "Default Mode")),
                                  #        column(2,actionButton(class="mode_buttons","mode_2", "Selection Mode")),
                                  #
                                  #        ),
                                  # column(3,
                                  #
                                  #        column(5,actionButton(class="restart","restart", "Start Over")),
                                  #        column(1,actionButton(class="mode_buttons","save_project", "Save Project"))
                                  #
                                  #        )
                                  #####

                              #  )

                              ),
                              wellPanel( class="wellPanel", id="well_panel_click",

                                         div(id = "block_1", class = "phase_title", tags$svg()),


                              ),
                           )
                     ),


         d3Output("d3"),
)
