import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmailAuditDisplay, EmailReminderDetails, updateEmailReminderDetails } from '../manageAuditsClasses'
import { GridOptions } from 'ag-grid-community';
import { Router, ActivatedRoute } from '@angular/router';
import { KeyValuePairDTO } from '../../Common/KeyValuePairDTO';
import { ManageAuditService } from '../manage-audits.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../Shared/confirm-dialog/confirm-dialog.component'
import { CustomCheckboxComponent } from '../../Custom/custom-checkbox/custom-checkbox.component'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
declare var jQuery: any;
@Component({
  selector: 'app-email-reminders',
  templateUrl: './email-reminders.component.html',
  styleUrls: ['./email-reminders.component.css']
})
export class EmailRemindersComponent implements OnInit {
  @Output() tabactive: EventEmitter<number> = new EventEmitter<number>();
  @Input() data;

  public modalRef: BsModalRef;
  public columnDefs: any[];
  public rowData: any[];
  public rowData1: any[];
  public defaultColDef;
  public rowSelection1;
  public gridOptions1;
  public pauditid;
  public params_audit_id;
  public flagchecked;
  public EmailDetailsArray: any[];
  public audit_id:any;
  public published:any;
  public noRowsTemplate;
  public loadingTemplate;
  public isAdmin: boolean = false;
  public actionParam:any;

  public timezoneSelectList: any[];
  public emailAuditDisplayData: EmailAuditDisplay;
  public emailReminderDetailsData: EmailReminderDetails;
  public updateEmailReminderDetailsData: updateEmailReminderDetails;

  public isEditable: boolean;
  public orgData: any
//private _matDialog: MatDialog
  constructor(private router: Router, private _routeParameters: ActivatedRoute, private _manageAuditsServiceClient: ManageAuditService,
     public toastr: ToastrService, private modalService: BsModalService, private _router: Router, private spinnerService: NgxSpinnerService) {
    this.emailAuditDisplayData = new EmailAuditDisplay();
    this.emailReminderDetailsData = new EmailReminderDetails();
    this.updateEmailReminderDetailsData = new updateEmailReminderDetails();
    this.gridOptions1 = <GridOptions>{}

    this.orgData = this._manageAuditsServiceClient.getPreviewAuditData();

    this.columnDefs = [
      { headerName: '', field: 'email_flag', headerCheckboxSelection: false, checkboxSelection: false, maxWidth:50, cellRendererFramework: CustomCheckboxComponent,
      cellClass: (node) => (!this.isEditable && this._manageAuditsServiceClient.hasExistingData(this.orgData, 'control_name', node.data.control_name)) ? 'art-disable' : ''
      },
      { headerName: 'Parent Category', field: 'parent_category_name', filter: false, sortable: false, minWidth: 300 },
      { headerName: 'Category ', field: 'category_name', filter: false, sortable: false, minWidth: 300 },
      { headerName: 'Control', field: 'control_name', filter: false, sortable: false, editable: false, minWidth: 500 }

    ]
    this.defaultColDef = {
      flex:1,      
      resizable: true,
    };
    this.rowSelection1 = "multiple";

    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">controls are Loading....</span>`;
    this.noRowsTemplate =
      `<span class="ag-overlay-loading-center">No categories & controls added.</span>`;

    this.isEditable = this._manageAuditsServiceClient.isRecordEditable();

  }

  ngOnInit() {
    this._routeParameters.params.subscribe((data) => {
      this.actionParam = data['action'];
    })
   if(this.actionParam=='view'){
      this.isAdmin = this.actionParam == 'view' ? true : false;
   }
    this.audit_id=this.data[0].audit_id;
    this.published=this.data[0].published;
    // if(this.published=='Yes'){
    // this.isAdmin = this.published == 'Yes' ? true : false;
    // }
    this._manageAuditsServiceClient.showTimezoneDetails(this.emailReminderDetailsData).subscribe((data: KeyValuePairDTO[]) => {
      this.timezoneSelectList = data;
    });
  
  

    this.ShowEmailReminderDetails();
    
/*
    jQuery(".ag-header-row .ag-checkbox-input").click(function(){
      for (let x of this.gridOptions1.rowData) {
        x.email_flag = true;
      }
      
    });
*/
  }

  
  ShowEmailReminderDetails() {
    // check for the default settings to display table
    this.spinnerService.show()
    this._routeParameters.params.subscribe((data) => {
      this.params_audit_id = data['auditID'];
    });
          
    this._manageAuditsServiceClient.getEmailReminderDetails(this.params_audit_id).subscribe((data: EmailAuditDisplay[]) => {
      this.flagchecked = data['auditEmailDetails'];
      if(this.flagchecked!=null){
      for (let x of this.flagchecked) {
        if (x.email_flag == 'Y') {
          x.email_flag = true;
        }
        else {
          x.email_flag = false;
        }
      }
      this.spinnerService.hide()
    }
      this.rowData = this.flagchecked;
      this.gridOptions1.api.refreshCells();
      this.emailReminderDetailsData.email_reminder_until = data['email_reminder_until'];
      this.emailReminderDetailsData.email_reminder_timezone = data['email_reminder_timezone'];      
      var res = data['email_reminder_days'].split(",");
      // have to streamline below code     
      res.forEach(function (item, index) {
        if (item == 'Mo') {
          jQuery("#weekday-mon").prop("checked", true);
        }
        if (item == 'Tu') {
          jQuery("#weekday-tue").prop("checked", true);
        }
        if (item == 'We') {
          jQuery("#weekday-wed").prop("checked", true);
        }
        if (item == 'Th') {
          jQuery("#weekday-thu").prop("checked", true);
        }
        if (item == 'Fr') {
          jQuery("#weekday-fri").prop("checked", true);
        }
        //  console.log(item, index);
      });
      // 12 hr to 24 hr format
      var time = data['email_reminder_time'];
      var hours = Number(time.match(/^(\d+)/)[1]);
      var minutes = Number(time.match(/:(\d+)/)[1]);
      var AMPM = time.match(/\s(.*)$/)[1];
      if (AMPM == "PM" && hours < 12) hours = hours + 12;
      if (AMPM == "AM" && hours == 12) hours = hours - 12;
      var sHours = hours.toString();
      var sMinutes = minutes.toString();
      if (hours < 10) sHours = "0" + sHours;
      if (minutes < 10) sMinutes = "0" + sMinutes;
      console.log(sHours + ":" + sMinutes);
      this.emailReminderDetailsData.email_reminder_time = sHours + ":" + sMinutes
      this._manageAuditsServiceClient.disableCheckbox();
    })

  }
  time12hrformat() {
    // To store time value in 12 hr format  
    var timeSplit = this.emailReminderDetailsData.email_reminder_time.split(':'), hours, minutes, meridian, timeval;
    hours = timeSplit[0];
    minutes = timeSplit[1];
    if (hours > 12) {
      meridian = 'PM';
      hours -= 12;
    } else if (hours < 12) {
      meridian = 'AM';
      if (hours == 0) {
        hours = 12;
      }
    } else {
      meridian = 'PM';
    }
    return timeval = hours + ':' + minutes + ' ' + meridian;
    //console.log(hours + ':' + minutes + ' ' + meridian);
  }

  emailvalidationcontrol(weekdayVal): boolean {
    var result = false;
    if ((weekdayVal != "") && (this.emailReminderDetailsData.email_reminder_timezone != "") && (this.emailReminderDetailsData.email_reminder_timezone != null) && (this.emailReminderDetailsData.email_reminder_time != "") && (this.emailReminderDetailsData.email_reminder_until != null)) {
      result = true;
    }
    else {
      this.toastr.error("Please enter the required fields  ", 'error');
      result = false;
      return result;
    }

    return result;
  }

  // Save button method
  SaveEmailReminderDetails() {   
    if(this.rowData!=null  &&  this.rowData.length!=0){
    var weekdayVal = '';
          jQuery('.weekDays-selector input[type=checkbox]').each(function () {
          if (this.checked) {
            //console.log("tsave23232323232est"+jQuery(this).val()); 
            var newval = jQuery(this).val();
            if (weekdayVal == '') {
              weekdayVal = newval;
            } else {
              weekdayVal = weekdayVal + "," + newval; // to store in this format in DB

            }
            console.log(weekdayVal);
          }
        });

    //validation starts
    if (this.emailvalidationcontrol(weekdayVal)) {
          // Getting weekday checkbox selected values starts       
          var timevalue = this.time12hrformat();
          var until = this.emailReminderDetailsData.email_reminder_until;
          var timezoneval = this.emailReminderDetailsData.email_reminder_timezone;
          console.log(this.emailReminderDetailsData);

          
          this.EmailDetailsArray = this.flagchecked.filter(x => x.email_flag == true);          
          if (this.EmailDetailsArray.length > 0) {
            this.EmailDetailsArray.forEach(x => {
              x.email_reminder_time = timevalue;
              x.email_reminder_days = weekdayVal;
              x.email_reminder_timezone = timezoneval;
              x.email_reminder_until = until;
            });
            this.updateEmailReminderDetailsData.EmailReminderDetails = this.EmailDetailsArray;
            this.updateEmailReminderDetailsData.p_audit_id = this.params_audit_id ;            
            this.updateEmailReminderDetailsData.p_user_id = sessionStorage.getItem('UserID'); //794023
            this._manageAuditsServiceClient.saveEmailReminderDetails(this.updateEmailReminderDetailsData).subscribe((data: any) => {
              if (data == 'failure') {
                this.toastr.error("Data not saved", 'error');
              } else {
                this.toastr.success("Data saved successfully.", 'Success', { enableHtml: true });                
              }
            });
          }
          else {
            this.toastr.error("Please select atleast one category  ", 'error');
          }
    }
    // validation ends
  }
  else{
    this.toastr.error("Data Should not be empty", 'error');
  }
  }
  Proceed() {
      // Getting weekday checkbox selected values starts
      if(this.rowData!=null  &&  this.rowData.length!=0){
      var weekdayVal = '';
      jQuery('.weekDays-selector input[type=checkbox]').each(function () {
        if (this.checked) {
          var newval = jQuery(this).val();
          if (weekdayVal == '') {
            weekdayVal = newval;
          } else {
            weekdayVal = weekdayVal + "," + newval; // to store in this format in DB

          }
          console.log(weekdayVal);
        }
      });
    if (this.emailvalidationcontrol(weekdayVal)) {
      var timevalue = this.time12hrformat();
      var until = this.emailReminderDetailsData.email_reminder_until;
      var timezoneval = this.emailReminderDetailsData.email_reminder_timezone;    
      this.EmailDetailsArray = this.flagchecked.filter(x => x.email_flag == true);      
      if (this.EmailDetailsArray.length > 0) {
        this.EmailDetailsArray.forEach(x => {
          x.email_reminder_time = timevalue;
          x.email_reminder_days = weekdayVal;
          x.email_reminder_timezone = timezoneval;
          x.email_reminder_until = until;
        });
        this.updateEmailReminderDetailsData.EmailReminderDetails = this.EmailDetailsArray;
        this.updateEmailReminderDetailsData.p_audit_id = this.params_audit_id ;        
        this.updateEmailReminderDetailsData.p_user_id = sessionStorage.getItem('UserID'); //794023

        this._manageAuditsServiceClient.saveEmailReminderDetails(this.updateEmailReminderDetailsData).subscribe((data: any) => {
          if (data == 'failure') {
            this.toastr.error("Data not saved", 'error');
          } else {            
            this.tabactive.emit(4);
          }
        });
      }
      else {
        this.toastr.error("Please select atleast one category  ", 'error');
      }      
    }
  }
  else{
    this.toastr.error("Data Should not be empty", 'error');
  }
  }

  GoBacktoManagePOC(): void {
    this.tabactive.emit(2);
  }
  CancelAudit():void{
    if(this.isAdmin==false){
      this.modalRef = this.modalService.show(ConfirmDialogComponent, {
        initialState: {
          title: "Control Items",
          message: "Are you sure you want to Discard your changes?",
          callback: (result) => {
            if(result == "yes") {
              this._router.navigateByUrl('/Manageaudits');
            }
          }
        }
      })
    } else {
      this._router.navigateByUrl('/Manageaudits');
    }
  }

/*
const dialogRef = this._matDialog.open(ConfirmDialogComponent, {
      maxWidth: "600px",
      maxHeight : "200px",
      data: {
          title: "Control Items",
          message: "Are you sure you want to Discard your changes?"}
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult){
        this._router.navigateByUrl('/Manageaudits/');
      }
    })
*/
}
