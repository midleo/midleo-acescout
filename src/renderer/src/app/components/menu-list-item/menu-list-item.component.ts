import { DataService } from './../../common/data.service';
import { ElectronService } from '../../core/electron.service';
import { Component, HostBinding, Inject, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NavService } from './nav.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  standalone: false,
  selector: 'app-confirm-delete-dialog',
  template: `
    <h2 mat-dialog-title>Remove connection?</h2>
    <mat-dialog-content>
      <p>Remove <strong>{{ data.aceName }}</strong> from group <strong>{{ data.groupName }}</strong>?</p>
      <p class="confirm-hint">This only removes the saved connection profile. It does not delete anything on the ACE server.</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">Remove</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .confirm-hint { font-size: 13px; color: var(--midleo-text-muted); margin-top: 8px; }
  `],
})
export class ConfirmDeleteDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { aceName: string; groupName: string }) {}
}

@Component({
  standalone: false,
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['./menu-list-item.component.scss'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
    ]),
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('200ms ease-out', style({ height: '*', opacity: 1 })),
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ height: 0, opacity: 0 })),
      ]),
    ]),
  ],
})
export class MenuListItemComponent implements OnInit {
  expanded = false;
  isDeleting = false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: any;
  @Input() previtem: any;
  @Input() itemkey: any;
  @Input() groupIndex: number;
  @Input() aceIndex: number;
  @Input() depth: number;

  constructor(
    public navService: NavService,
    public dataServ: DataService,
    private snackBar: MatSnackBar,
    private electron: ElectronService,
    private dialog: MatDialog,
    public router: Router
  ) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  ngOnInit() {}

  isActiveRoute(route: string): boolean {
    if (!route || route === 'deleteACE') {
      return false;
    }
    const suffix = `:${this.dataServ.jsonkey}${this.dataServ.jsonsubkey}`;
    return this.router.url.includes(route + suffix) || this.router.url.includes(route + '/');
  }

  onItemSelected(item: any, previtem: any, itemkey: any, event?: Event) {
    event?.stopPropagation();

    if (item.children?.length) {
      this.expanded = !this.expanded;
      this.ariaExpanded = this.expanded;
      return;
    }

    if (this.depth === 0) {
      this.dataServ.jsonkey = this.groupIndex ?? itemkey;
      this.dataServ.jsonkeychanged = true;
    }
    if (this.depth >= 1 && !item.children?.length) {
      this.dataServ.jsonkey = this.groupIndex;
      this.dataServ.jsonsubkey = this.aceIndex;
      this.dataServ.jsonkeychanged = true;
    }

    if (item.route === 'deleteACE') {
      this.confirmDelete();
      return;
    }

    this.snackBar.open('Loading data…', '', { duration: 3000 });
    this.dataServ.loadthis = true;
    this.dataServ.arrACEtemp = previtem;
    this.router.navigate([item.route + '/:' + this.dataServ.jsonkey + this.dataServ.jsonsubkey]);
  }

  confirmDelete(): void {
    const resolved = this.resolveAceIndices();
    if (!resolved) {
      this.snackBar.open('Could not find ACE server to remove', '', { duration: 4000 });
      return;
    }

    const { groupIndex, childIndex, group, ace } = resolved;

    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
      data: { aceName: ace.name, groupName: group.name },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        void this.deleteACE(groupIndex, childIndex);
      }
    });
  }

  private resolveAceIndices(): {
    groupIndex: number;
    childIndex: number;
    group: { name: string; children: unknown[] };
    ace: { name: string };
  } | null {
    const ace = this.previtem;
    if (!ace?.name) {
      return null;
    }

    if (this.groupIndex != null && this.aceIndex != null) {
      const group = this.dataServ.arrACE?.[this.groupIndex];
      const child = group?.children?.[this.aceIndex];
      if (group && child?.name === ace.name) {
        return { groupIndex: this.groupIndex, childIndex: this.aceIndex, group, ace };
      }
    }

    for (let i = 0; i < (this.dataServ.arrACE?.length ?? 0); i++) {
      const group = this.dataServ.arrACE[i];
      const children = group?.children ?? [];
      const j = children.findIndex(
        (c: { name?: string; hostname?: string }) =>
          c?.name === ace.name && (!ace.hostname || c.hostname === ace.hostname)
      );
      if (j >= 0) {
        return { groupIndex: i, childIndex: j, group, ace: children[j] };
      }
    }

    return null;
  }

  async deleteACE(groupIndex: number, childIndex: number) {
    if (this.isDeleting) {
      return;
    }
    this.isDeleting = true;

    const groups = [...this.dataServ.arrACE];
    groups[groupIndex] = { ...groups[groupIndex], children: [...groups[groupIndex].children] };
    groups[groupIndex].children.splice(childIndex, 1);

    if (!groups[groupIndex].children.length) {
      groups.splice(groupIndex, 1);
    }

    this.dataServ.arrACE = groups;
    this.dataServ.jsonkeychanged = true;

    try {
      const acereply = await this.electron.updateAce(JSON.stringify(this.dataServ.arrACE));
      this.snackBar.open(acereply, '', { duration: 3000 });
      this.router.navigate(['/']);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update ACE servers';
      this.snackBar.open(message, '', { duration: 5000 });
    } finally {
      this.isDeleting = false;
    }
  }

  trackByAceName(_index: number, child: { name?: string }): string {
    return child?.name ?? String(_index);
  }
}
