import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  public name1:string = '';
  public questionList:any = [];
  public currentQuestion:number = 0;
  public points:number = 0;
  counter:number = 60;
  public correctAns:number = 0;
  public IncorrectAns:number = 0;
  public notAns:number = 0;
  interval$:any;
  progress:string = "0";
  isQuizDone:boolean = false;

  constructor(private question:QuestionService) { }

  ngOnInit(): void {

    this.name1 = localStorage.getItem("name")!;
    this.getAllQuestion();
    this.startCounter();
  }

  getAllQuestion(){

      this.question.getQuestionJson().subscribe(res=>{

          this.questionList = res.questions;
      })
  }

  nextQuestion(){

      this.currentQuestion++;
  }

  previousQuestion(){

      this.currentQuestion--;
  }

  ansQuestion(CurrQno:number , option:any){

     if(CurrQno === this.questionList.length){

         this.isQuizDone = true;
         this.stopCounter();
     }

      if(option.correct){

           this.points = this.points+10;
           this.correctAns++;
           this.currentQuestion++;
           this.resetCounter();
           this.getProgress();
         
      }else{

          this.currentQuestion++;
          this.IncorrectAns++;
          this.resetCounter();
          this.getProgress()
          this.points = this.points-10;
     }  
  }

  startCounter(){
 
     this.interval$ = interval(1000).subscribe(val=>{

        this.counter--;
        if(this.counter === 0){

            this.notAns++;
            this.currentQuestion++;
            this.counter = 60;
        }
     });

     setTimeout(() => {
       this.interval$.unsubscribe();
     }, 600000); 
  }

  stopCounter(){
 
     this.interval$.unsubscribe();
     this.counter = 0;
  }

  resetCounter(){
  
     this.stopCounter();
     this.counter = 60;
     this.startCounter();
     this.progress = "0";
  }

  resetQuiz(){
     
      this.resetCounter();
      this.getAllQuestion();
      this.points = 0;
      this.counter = 60;
      this.currentQuestion = 0;
   
  }

  getProgress(){

      this.progress = JSON.stringify(this.currentQuestion/this.questionList.length*100)
      return this.progress;
  }

}
