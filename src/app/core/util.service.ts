import { Injectable } from '@angular/core';
// import { BMSMessageBox, BMSMessageBoxColorMode, BMSMessageBoxMode } from '../ux/bmsmsgbox/bmsmsgbox.component';
import { MatDialog } from '@angular/material/dialog';

/**
  Service used to read app configuration settings from Environment files
*/

@Injectable({
    providedIn: 'root',
})
export class UtilService {

    constructor(public dialog: MatDialog) {}

    //this.util.showMessage("", "Visit Request Details Saved Successfully", BMSMessageBoxColorMode.Information, BMSMessageBoxMode.MessageBox)

    // public showMessage(Title: string, message: string, colorMode: BMSMessageBoxColorMode, mode: BMSMessageBoxMode): Promise<any> {
    //     const panelClass = colorMode === BMSMessageBoxColorMode.Danger ? 'mb-danger' : (colorMode === BMSMessageBoxColorMode.Warning ? 'mb-warning' : 'mb-info');
    //     const modalRef = this.dialog.open(BMSMessageBox, { disableClose: true, width: '350px', panelClass: panelClass });
    //     modalRef.componentInstance.msgBoxTitle = Title;
    //     modalRef.componentInstance.message = message;
    //     modalRef.componentInstance.mode = mode;
    //     modalRef.componentInstance.colorMode = colorMode;
    //     return modalRef.afterClosed().toPromise();
    // }

    public getDateDiffByMinues(startDate: Date, endDate: Date): number {
        return Math.floor((endDate.getTime() - startDate.getTime()) / 60000);
    }


    private getTagsHtml(tagName: keyof HTMLElementTagNameMap): string {
        const htmlStr: string[] = [];
        const elements = document.getElementsByTagName(tagName);
        for (let idx = 0; idx < elements.length; idx++) {
            htmlStr.push(elements[idx].outerHTML);
        }

        return htmlStr.join('\r\n');
    }


    public printSection(sectionId: string) {
        //changes
        //const printContents = document.getElementById(sectionId).outerHTML;
        const printContentsdt: any = document.getElementById(sectionId);
        const printContents = printContentsdt.outerHTML;
        const stylesHtml = this.getTagsHtml('style');
        const linksHtml = this.getTagsHtml('link');

        const popupWin: any = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
        popupWin.document.open();
        popupWin.document.write(`
    <html>
        <head>
            <title>Print tab</title>
            ${linksHtml}
            ${stylesHtml}
        </head>
        <body onload="window.print(); window.close()">
        <div class="container col-12 p-0">
            ${printContents}
            </div>
        </body>
    </html>
    `
        );
        popupWin.document.close();
    }
}
