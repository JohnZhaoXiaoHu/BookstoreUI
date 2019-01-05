import { Component, OnInit} from '@angular/core';
import { GetBookListService } from '../../services/get-book-list.service';
import { Book } from 'src/app/models/book';
import { Router } from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { RemoveBookService } from '../../services/remove-book.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  private selectedBook: Book;
  private checked: boolean;
  private bookList: Book[];
  private allChecked: boolean;
  private removeBookList: Book[] = new Array();

  constructor(
    private getBookListService: GetBookListService,
    private removeBookService: RemoveBookService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  openDialog(book: Book) {
    let dialogRef = this.dialog.open(DialogResultExampleDialog);
    dialogRef.afterClosed().subscribe(
      result => {
        console.log(result);
        if (result=="yes") {
          this.removeBookService.sendBook(book.id).subscribe(
            res => {
              console.log(res);
              this.getBookList();
            },
            err => {
              console.log("openDialog"+err);
            });
            location.reload();
          }
        }
        );
      }

  removeSelectedBooks() {
    let dialogRef = this.dialog.open(DialogResultExampleDialog);
    dialogRef.afterClosed().subscribe(
      result => {
        console.log(result);
        if (result=="yes") {
          for ( let book of this.removeBookList) {
            this.removeBookService.sendBook(book.id).subscribe(
              res => {
              },
              err => {
                console.log(err);
              }
              );
            }
            location.reload();
          }
        }
        );
      }
  
  updateRemoveBookList(checked:boolean, book:Book) {
    if (checked) {
      this.removeBookList.push(book);
    } else {
      this.removeBookList.splice(this.removeBookList.indexOf(book),1);
    }
  }

  updateSelected(checked:boolean) {
    if(checked) {
      this.allChecked = true;
      this.removeBookList=this.bookList.slice();
    } else {
      this.allChecked=false;
      this.removeBookList=[];
    }
  }
  
  getBookList() {
    this.getBookListService.getBookList().subscribe(
      res => {
        console.log(res);
        this.bookList = JSON.parse(JSON.stringify(res));
      },
      error => {
        console.log(error);
      }
    );
  }

  onSelect(book:Book) {
    this.selectedBook=book;
    this.router.navigate(['/viewBook', this.selectedBook.id]);
  }

  ngOnInit() {
    this.getBookList();
  }
}

@Component({
  selector: 'dialog-result-example-dialog',
  templateUrl: './dialog-result-example-dialog.html'
})
export class DialogResultExampleDialog {
  constructor(public dialogRef: MatDialogRef<DialogResultExampleDialog>) {}
}
