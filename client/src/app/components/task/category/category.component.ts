import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../../services/api.service';
import { Task, AssigneeData, Category } from '../../../../shared/shared.object';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastService } from '../../../../shared/shared.service';
import { NgForm } from '@angular/forms/src/directives/ng_form';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  public enableLoader: boolean;
  public categoryData: Array<any>;
  public category: Category;
  public button: string;
  public enableEditService: boolean;
  public categoryDataLength: number;
  public index:number;

  @Input() modalRef: BsModalRef;
  constructor(public userService: UserService,
    public toasty: ToastService,
    private modalService: BsModalService, ) {
    this.category = new Category();
    this.button = "Add";
    this.enableEditService = false;
    this.categoryData = new Array<Object>();
  }

  ngOnInit() {

    this.getCategoryById()

  }

  getCategoryById() {
    this.categoryData = new Array<Object>();
    this.enableLoader = true;
    let aaded_by = JSON.parse(localStorage.getItem('user')).id;
    this.userService.getCategoryById(aaded_by)
      .subscribe(res => {
        this.enableLoader = false;
        let response: any = res;
        let responseData = response.data;
        this.categoryDataLength = responseData.length;
        for (var i = 0; i < this.categoryDataLength; i++) {
          let obj = {
            categoryName: responseData[i].category_name,
            categoryId: responseData[i].id,
            addedBy: responseData[i].added_by,
            createdDate: responseData[i].created_date
          }
          this.categoryData.push(obj);

        }
      }, err => {
        this.enableLoader = false;
        this.toasty.show('error', err.error.message);
      })
  }

  trimField() {
    if (this.category.category_name) {
      this.category.category_name = this.category.category_name.trim();
      this.category.category_name = this.category.category_name.replace(/  +/g, ' ');
    }

  }

  /* Delete category */

  // modelTaskDeleted(template: TemplateRef<any>, id) {
  //   this.category.id = id;
  //   this.modalRef = this.modalService.show(template, id);
  // }

  // deleteCategory() {
  //   this.enableLoader = true;
  //   this.userService.deleteCategoryById(this.category.id)
  //     .subscribe(res => {
  //       this.enableLoader = false;
  //       let response: any = res
  //       this.category = new Category();
  //       this.getCategoryById();
  //       this.toasty.show("success", response.message);
  //     }, err => {
  //       this.enableLoader = false;
  //       this.toasty.show('error', "Something wrong please try again");
  //     })
  // }

  /* Save Category */
  saveCategory(form: NgForm, template: TemplateRef<any>) {

    /* Update Service */
    if (!!this.enableEditService) {
     if(this.category.category_name == this.categoryData[this.index].categoryName)
      {
        this.getCategoryById();
        form.resetForm();
        this.enableEditService = false;
        this.button = "Add"
        this.toasty.show("success", "Category update successfully");
      }
      else
      {
      this.userService.checkCategoryTaskExist(this.category.id).
        subscribe(res => {
          let response: any = res;
          /* check category already exist or not */
          if (!!response.categoryExist) {
            this.modalRef = this.modalService.show(template);
          }
          else {
            this.updateCategory(form)
          }
        })

    }
  }
    /* Add Category Service */
    else {
      this.insertCategory(form, this.category)

    }
  }

  insertCategory(form: NgForm, category) {
    this.enableLoader = true;
    this.category.added_by = JSON.parse(localStorage.getItem('user')).id;
    this.userService.saveCategory(this.category)
      .subscribe(res => {
        this.enableLoader = false;
        let response: any = res;
        if (!response.alreadyExist) {
          this.getCategoryById();
          form.resetForm();
          this.enableEditService = false;
          this.button = "Add"
          this.toasty.show("success", response.message);
        } else {
          form.resetForm();
          this.enableEditService = false;
          this.button = "Add"
          this.toasty.show('error', response.message);
        }
      }, err => {
        this.enableLoader = false;
        this.enableEditService = false;
        this.toasty.show('error', err.message)
      });
  }

  updateCategory(form: NgForm) {
    this.enableLoader = true;
    this.userService.upadateCategory(this.category)
      .subscribe(
      res => {
        let response: any = res;
        this.enableLoader = false;
        if(!response.alreadyExist)
        {
          this.getCategoryById();
          form.resetForm();
          this.enableEditService = false;
          this.button = "Add"
          this.toasty.show("success", response.message);
        }
        else
        {
          form.resetForm();
          this.enableEditService = false;
          this.button = "Add"
          this.toasty.show('error', response.message);
        }
        

      }, err => {
        this.enableLoader = false;
        this.enableEditService = false;
        this.toasty.show('error', "Something wrong please try again");
      })
  }


  editService(index,categoryData) {
    this.enableEditService = true;
    this.index =index;
    this.button = "Update"
    this.category.category_name = this.categoryData[index].categoryName;
    this.category.id = this.categoryData[index].categoryId

  }

  hideModal(form :NgForm)
  {
    form.resetForm()
    this.enableEditService=false;
    this.button = "Add"
    this.modalRef.hide()
  }

  cancleUpdate(form :NgForm)
  {
    form.resetForm()
    this.enableEditService=false;
    this.button = "Add"
  }
}
