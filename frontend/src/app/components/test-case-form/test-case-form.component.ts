import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectContextService } from '../../services/project-context.service';
import { TestCasesService } from '../../services/test-cases.service';
import { TestCase } from '../../interfaces/test-case';
import { FileService } from '../../services/files.service';

@Component({
  selector: 'app-test-case-form',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './test-case-form.component.html',
  styleUrl: './test-case-form.component.css'
})
export class TestCaseFormComponent implements OnInit {
  projectId: any | null = null;
  testcaseId: any | null = null;
  testcase: TestCase = {
    project_id: this.projectId,
    test_case_id: '',
    description: '',
    test_steps: '',
    prerequisites: '',
    test_data: '',
    expected_result: '',
    actual_result: '',
    status: 'planned',
    evidence_link: '',
  };

  selectedFile: File | null = null;
  pendingFileUpload: boolean = false;
  pendingFileRemoval: boolean = false;

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, false] }],
      [{ 'align': [] }],
      ['clean']
    ]
  };

  constructor(
    private testcasesSvc: TestCasesService,
    private projectCtx: ProjectContextService,
    private route: ActivatedRoute,
    private router: Router,
    private fileSvc: FileService,
  ) { }

  ngOnInit(): void {
    const id = this.projectCtx.getProjectId();
    if (id) {
      this.projectId = id;
      this.testcase.project_id = id;
    }

    const idParam = this.route.snapshot.paramMap.get('testcaseId');
    if (idParam && !isNaN(+idParam)) {
      this.testcaseId = +idParam;
      this.loadTestCase(this.testcaseId);
    }
  }

  loadTestCase(id: number) {
    this.testcasesSvc.getTestCaseById(id).subscribe({
      next: (data) => {
        this.testcase = { ...data }
      },
      error: (err) => console.error('Failed to get test case:', err)
    });
  }

  onSubmit(): void {
    const saveOperation = () => {
      if (this.testcaseId) {
        this.testcasesSvc.updateTestCase(this.testcase).subscribe({
          next: () => this.router.navigate([`/projects/${this.projectId}/testcases`]),
          error: (err) => console.error('Failed to save test case:', err)
        });
      } else {
        this.testcasesSvc.addTestCase(this.testcase).subscribe({
          next: () => this.router.navigate([`/projects/${this.projectId}/testcases`]),
          error: (err) => console.error('Failed to save test case:', err)
        });
      }
    };

    // Handle file removal
    if (this.pendingFileRemoval && this.testcase.evidence_link) {
      this.fileSvc.deleteFile(this.testcase.evidence_link).subscribe({
        next: () => {
          this.testcase.evidence_link = '';
          this.pendingFileRemoval = false;
          saveOperation();
        },
        error: (err) => {
          console.error('File deletion failed:', err);
          saveOperation();
        }
      });
    }

    // Handle file upload
    else if (this.pendingFileUpload && this.selectedFile && this.projectId) {
      this.fileSvc.uploadFile(this.selectedFile, this.projectId).subscribe({
        next: (res) => {
          this.testcase.evidence_link = res.file_url;
          this.pendingFileUpload = false;
          this.selectedFile = null;
          saveOperation();
        },
        error: (err) => {
          console.error('File upload failed:', err);
          saveOperation();
        }
      });
    }

    // If no file changes, just save
    else {
      saveOperation();
    }
  }

  deleteTestCase(): void {
    this.testcasesSvc.deleteTestCase(this.testcaseId).subscribe({
      next: () => {
        this.router.navigate([`/projects/${this.projectId}/testcases`]);
      },
      error: (err) => console.error('Failed to delete test case', err)
    });
  }

  onCancel(): void {
    this.router.navigate([`/projects/${this.projectId}/testcases`]);
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.pendingFileUpload = true;
      this.pendingFileRemoval = false;
    }
  }

  removeEvidence(): void {
    this.selectedFile = null;
    this.pendingFileRemoval = true;
    this.pendingFileUpload = false;
  }
}
