
/*function check_alert(f_data){
  alert(f_data.blocks[1].block_id);
}*/





//finds drug load --> DL
function find_related_dosage(f_data,block_id,question_id){
  for(var r1 in f_data.answers_concept_definition)
       {
          if( f_data.answers_concept_definition[r1].qs_id == question_id)
          {
            for( var o in f_data.answers_concept_definition[r1].affected_dosage_blocks)
               {
                if(f_data.answers_concept_definition[r1].affected_dosage_blocks[o].block_id == block_id){
                  var dosage = f_data.answers_concept_definition[r1].affected_dosage_blocks[o].affected_dosage;
                  return(dosage);

        }
      }
    }
  }
}
