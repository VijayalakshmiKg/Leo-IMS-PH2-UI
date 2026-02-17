import { Directive, HostListener } from '@angular/core';


@Directive({
  selector: '[appLettersOnly]'
})
export class LettersOnlyDirective {
  key:any;
//   // Listen to the input event on the element
//   @HostListener('input', ['$event']) onInput(event: KeyboardEvent) {
//     const input = event.target as HTMLInputElement;
//     // Replace any character that is not a letter with an empty string
//     // Validators.pattern('')
//     // input.value = input.value.replace(/[^a-zA-Z]/g, '');
// input.value = input.value.replace(/^[0-9 \-\']+/, '');

//     // //console.log(data);
//     // return data;
   
//   }

//   // Optionally, listen to the paste event to prevent invalid characters on paste
  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData?.getData('text') || '';
    //console.log(pastedText);
    // If pasted text contains invalid characters, prevent paste
    if (/[^a-zA-Z]/.test(pastedText)) {
      event.preventDefault();
    }
    // if ((clipboardData >= 15 && clipboardData <= 64) || (clipboardData >= 123) || (clipboardData >= 96 && clipboardData <= 105)) {
    //   event.preventDefault();
    // }
  }
@HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {

  this.key = event.keyCode;
  //console.log(this.key);
  if ((this.key >= 15 && this.key <= 64) || (this.key >= 123) || (this.key >= 96 && this.key <= 105)) {
    event.preventDefault();
  }
}
}
