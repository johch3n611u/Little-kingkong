import { Component, OnInit, Input } from '@angular/core';
import Editor from 'cl-editor';
import * as $ from 'jquery';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-posts',
  template: `
    <div class="posts">
    <mat-card>
        <div class="posts_title">
          <a [href]='SRurl' target="_blank"><mat-card-title>{{Poststitle}}</mat-card-title></a>
          <button type="text" mat-button form="posts">Submit</button>
        </div>
        <mat-card-content>
            <form id="posts" [formGroup]="form" (ngSubmit)="submit()">
                <p>
                    <mat-form-field>
                        <input type="text" matInput placeholder="Sort" formControlName="sort">
                    </mat-form-field>
                    <mat-form-field>
                        <input type="text" matInput placeholder="ImgUrl" formControlName="imgUrl">
                    </mat-form-field>
                </p>
                <p>
                    <mat-form-field>
                        <input type="text" matInput placeholder="Title" formControlName="title">
                    </mat-form-field>
                    <mat-form-field>
                        <input type="text" matInput placeholder="Subtitle" formControlName="subtitle">
                    </mat-form-field>
                </p>
                <div id="editor" class="editor" ></div>

                <div class="displaynone">
                   <mat-form-field>
                        <input type="text" matInput formControlName="id">
                   </mat-form-field>
                   <mat-form-field>
                       <textarea matInput formControlName="contentText"></textarea>
                   </mat-form-field>
                   <mat-form-field>
                       <textarea matInput formControlName="contentHtml"></textarea>
                   </mat-form-field>
                </div>
            </form>
        </mat-card-content>
    </mat-card>
</div>`
  ,
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  // Program sequence run 3
  constructor(
    private formbilder: FormBuilder,
    private route: ActivatedRoute,
    private httpclient: HttpClient,
    private router: Router,
  ) { }

  

  // Program sequence run 4
  ngOnInit(): void {

    document.getElementById("editor").innerHTML = '';
    const editor = new Editor({
      target: document.getElementById('editor'),
      props: {
        height: '500px',
      }
    });
    $('.cl-button').attr('type', 'button');
    this.getupdateid();
    // Program sequence run 6
    this.getRequest(this.id);
  }

  // Program sequence run 1
  form: FormGroup = new FormGroup({
    sort: new FormControl(''),
    title: new FormControl(''),
    subtitle: new FormControl(''),
    contentText: new FormControl(''),
    contentHtml: new FormControl(''),
    imgUrl: new FormControl(''),
    id: new FormControl(''),
  });
  // Program sequence run 2
  Poststitle = 'Publish';
  id = +this.route.snapshot.paramMap.get('id');
  SRurl = 'https://pbi20200421.z7.web.core.windows.net/News.html?id=' + this.id;
  ngOnChanges() { }

  // Program sequence run 7
  ngDoCheck() {
    this.id = +this.route.snapshot.paramMap.get('id');
    // console.log('ngDoCheck=>id=' + this.id);
    if (this.id == 0) {
      this.Poststitle = 'Publish';
      this.resetform();
    }
  }

  ngAfterContentInit() { }

  ngAfterContentChecked() { }

  ngAfterViewInit() { }

  ngAfterViewChecked() { }

  ngOnDestroy() { }

  // Program sequence run 5
  getupdateid(): void {
    this.id = +this.route.snapshot.paramMap.get('id');
    //console.log('id=' + this.id);
    if (this.id !== 0) {
      //console.log('id!=0,id=' + this.id);
      this.Poststitle = 'Edit';
    } 
  }

  submit() {
    if (this.form.valid) {
      this.form.value.contentText = ((document.getElementsByClassName('cl-content')[0]) as HTMLElement).innerText;
      console.log('ContentText=' + this.form.value.ContentText)
      this.form.value.contentHtml = document.getElementsByClassName('cl-content')[0].innerHTML;
      console.log('ContentHtml=' + this.form.value.ContentHtml)
      this.form.value.id = +this.route.snapshot.paramMap.get('id');
      console.log('Id=' + this.route.snapshot.paramMap.get('id'));
    }

    this.id = +this.route.snapshot.paramMap.get('id');
    console.log('submit id=' + this.id)
    if (this.id == 0) {
      this.postRequest(this.form.value);
    } else if (this.id != 0) {
      this.putRequest(this.form.value);
    }
  }

  postRequest(form) {
    const apiurl = 'https://websitebackground20200423181629.azurewebsites.net/api/News/PostNews';
    const headers = new HttpHeaders({
      'Content-Type': 'text/json'
    });
    const options = {
      headers
    };
    console.log(form);
    const body = JSON.stringify(form);
    this.httpclient.post<any>(apiurl, body, options)
      .subscribe(
        (value) => {
          console.log('SuccessResponse:' + value);
          alert('Success Posts id:' + value.id);
          this.router.navigate(['/Home/Management']);
        }, (value) => {
          console.log('ErrorResponse:' + value);
          alert('ErrorResponse:' + value);
        }
      );
  }

  putRequest(form) {
    this.id = +this.route.snapshot.paramMap.get('id');
    //https://localhost:44367  https://websitebackground20200420071406.azurewebsites.net
    const apiurl = 'https://websitebackground20200423181629.azurewebsites.net/api/News/PutNews?id=' + this.id;
    const headers = new HttpHeaders({
      'Content-Type': 'text/json'
    });
    const options = {
      headers
    };
    console.log(form);
    const body = JSON.stringify(form);
    this.httpclient.put<any>(apiurl, body, options)
      .subscribe(
        (value) => {
          console.log('SuccessResponse:' + value);
          alert('Success Posts id:' + this.id);
          this.router.navigate(['/Home/Management']);
        }, (value) => {
          console.log('ErrorResponse:' + value);
          alert('ErrorResponse:' + value);
        }
      );
  }

  getRequest(id) {

    if (id != 0) {
      this.httpclient.get<any>(
        'https://websitebackground20200423181629.azurewebsites.net/api/News/GetNews?id=' + this.id
        //'/assets/fack.json'
      ).subscribe((value) => {
        console.log('SuccessGetQuery:' + value);
        document.getElementsByClassName('cl-content')[0].innerHTML = value.contentHtml;
        this.form.patchValue(value);
      }, (value) => {
        console.log('ErrorGetQuery:' + value);
      });
    }

  }

  resetform() {

    if (this.form.value.id != '') { 
    this.form.patchValue(
      {
        sort: '',
        title: '',
        subtitle: '',
        contentText: '',
        contentHtml: '',
        imgUrl: '',
        id: ''
      }
    );
    document.getElementsByClassName('cl-content')[0].innerHTML = '';}

  }

}
