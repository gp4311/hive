import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjectContextService } from '../../services/project-context.service';
import { TestCasesService } from '../../services/test-cases.service';
import { TestCase } from '../../interfaces/test-case';

@Component({
  selector: 'app-test-case-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-case-form.component.html',
  styleUrl: './test-case-form.component.css'
})
export class TestCaseFormComponent {

}
