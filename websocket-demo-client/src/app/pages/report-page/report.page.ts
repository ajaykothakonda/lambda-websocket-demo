import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Subscription, timer} from 'rxjs';
import {ReportParameters} from '../../types/report-parameters';

@Component({
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss']
})
export class ReportPage {
  public reportUrl: string;
  public error: string;
  public isGenerating: boolean;
  public generationSeconds: number;
  public timerSub: Subscription;

  private reportParameters: ReportParameters = {delay: 40000, amountOfRows: 500};

  // TODO Replace the endpoint below with the endpoint you can find in the Serverless deploy output
  private apiEndpoint = 'https://sdyqoa0bb2.execute-api.eu-west-1.amazonaws.com/dev/report';

  constructor(private http: HttpClient) {
  }

  public onGenerateReportRestAPI() {
    this.initializeReportGeneration();
    this.http.post(this.apiEndpoint, this.reportParameters).subscribe(reportUrl => {
      this.onReportGenerationSuccess(reportUrl.toString());
    }, (error) => {
      this.onReportGenerationFailure(error);
    });
  }

  private initializeReportGeneration() {
    this.error = undefined;
    this.reportUrl = undefined;
    this.isGenerating = true;
    this.startTimer();
  }

  private onReportGenerationSuccess(reportUrl: string) {
    this.reportUrl = reportUrl.toString();
    this.isGenerating = false;
    this.stopTimer();
  }

  private onReportGenerationFailure(error: any) {
    this.error = error;
    this.isGenerating = false;
    this.stopTimer();
  }

  private startTimer() {
    this.timerSub = timer(0, 1000).subscribe(t => {
      this.generationSeconds = t;
    });
  }

  private stopTimer() {
    this.timerSub.unsubscribe();
  }
}
