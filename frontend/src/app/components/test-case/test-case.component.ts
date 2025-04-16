import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectContextService } from '../../services/project-context.service';
import { TestCasesService } from '../../services/test-cases.service';
import { TestCase } from '../../interfaces/test-case';

@Component({
  selector: 'app-test-case',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-case.component.html',
  styleUrl: './test-case.component.css'
})
export class TestCaseComponent {

}
