import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ProjectContextService } from '../../services/project-context.service';
import { SubsystemService } from '../../services/subsystems.service';
import { PermissionService } from '../../services/permission.service';
import { Subsystem } from '../../interfaces/subsystem';

@Component({
  selector: 'app-subsystems',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule],
  templateUrl: './subsystems.component.html',
  styleUrl: './subsystems.component.css'
})
export class SubsystemsComponent {
  projectId: any | null = null;
  subsystems: Subsystem[] = [];
  newSubsystemName: string = '';
  newSubsystemDescription: string = '';
  editingSubsystemId: number | null = null;
  editedSubsystem: Subsystem | null = null;

  constructor(
    private projectCtx: ProjectContextService,
    private subsystemSvc: SubsystemService,
    public permission: PermissionService
  ) { }

  ngOnInit(): void {
    const id = this.projectCtx.getProjectId();
    if (id) {
      this.projectId = id;
      this.loadSubsystems(id);
    }
  }

  loadSubsystems(projectId: number): void {
    this.subsystemSvc.getSubsystemsByProject(projectId).subscribe({
      next: (subsystems) => {
        this.subsystems = subsystems;
      },
      error: (err) => console.error('Failed to load subsystems', err)
    });
  }

  addSubsystem(): void {
    if (this.newSubsystemName && this.newSubsystemDescription) {
      const newSubsystem: Subsystem = {
        project_id: this.projectId,
        name: this.newSubsystemName,
        description: this.newSubsystemDescription
      };

      this.subsystemSvc.addSubsystem(newSubsystem).subscribe({
        next: (created) => {
          this.subsystems.push(created);
          this.newSubsystemName = '';
          this.newSubsystemDescription = '';
        },
        error: (err) => console.error('Failed to add subsystem', err)
      });
    }
  }

  deleteSubsystem(id: number): void {
    this.subsystemSvc.deleteSubsystem(id).subscribe({
      next: () => {
        this.subsystems = this.subsystems.filter(subsystem => subsystem.id !== id);
      },
      error: (err) => console.error('Failed to delete subsystem', err)
    });
  }

  updateSubsystem(): void {
    if (!this.editedSubsystem) return;

    this.subsystemSvc.updateSubsystem(this.editedSubsystem).subscribe({
      next: (updated) => {
        const index = this.subsystems.findIndex(s => s.id === updated.id);
        if (index !== -1) {
          this.subsystems[index] = updated;
        }
        this.cancelEditing();
      },
      error: (err) => {
        console.error('Failed to update subsystem:', err);
      }
    });
  }

  startEditing(subsystem: Subsystem): void {
    if (subsystem.id) {
      this.editingSubsystemId = subsystem.id;
      this.editedSubsystem = { ...subsystem }; // shallow copy to preserve original
    } 
  }
  
  cancelEditing(): void {
    this.editingSubsystemId = null;
    this.editedSubsystem = null;
  }
}
