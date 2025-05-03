import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ProjectService } from '../../services/project.service';
import { ProjectContextService } from '../../services/project-context.service';
import { Project, SubsystemRequirementCount, RequirementStatusCount, RequirementPriorityCount, TestCaseStatusCount } from '../../interfaces/project';
import { SubsystemService } from '../../services/subsystems.service';
import { RequirementsService } from '../../services/requirements.service';
import { TestCasesService } from '../../services/test-cases.service';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent {
  projectId: any | null = null;
  project: Project = {
    name: '',
    description: '',
    status: 'active',
    start_date: '',
    end_date: ''
  };
  section: string | null = null;

  subsystemCount: number = 0;
  subsystemRequirementCounts: SubsystemRequirementCount[] = [];
  requirementCount: number = 0;
  requirementStatusCounts: RequirementStatusCount[] = [];
  requirementPriorityCounts: RequirementPriorityCount [] = [];
  testCaseCount: number = 0;
  testCaseStatusCounts: TestCaseStatusCount [] = [];
  testCasePassPercentage: number = 0;
  
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      y: {
        ticks: {
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          align: 'start'
        }
      },
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        }
      }
    }    
  };

  doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true,
        position: 'right' 
      },
      tooltip: { enabled: true }
    }
  };

  gaugeChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: -90,          // Start from top center
    circumference: 180,     // 180 degrees (semi circle)
    cutout: '70%',          // Donut thickness
    plugins: {
      legend: {
        display: true,
        position: 'right'
      },
      tooltip: { enabled: false }
    }  
  };

  subsystemRequirementChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Requirement Count Per Subsystem',
        data: [],
        backgroundColor: '#FB9927'
      }
    ]
  };

  requirementStatusChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Requirements by Status',
        data: [],
      }
    ]
  };

  statusColorMap: Record<string, string> = {
    draft: '#0077cc',
    reviewed: '#000080',
    approved: '#e6b800',
    verified: '#1e8e3e'
  };

  requirementPriorityChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Requirements by Priority',
        data: [],
      }
    ]
  };

  priorityColorMap: Record<string, string> = {
    high: '#d93025',
    medium: '#e6b800',
    low: '#1e8e3e'
  };
  
  testCaseStatusChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Test Cases',
        data: [],
      }
    ]
  };

  testCaseStatusColorMap: Record<string, string> = {
    planned: '#0077cc',
    in_progress: '#e6b800',
    passed: '#1e8e3e',
    failed: '#d93025'
  };

  gaugeChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Completed', 'Remaining'],
    datasets: [{
      data: [],
      backgroundColor: ['#4caf50', '#e0e0e0'],
      borderWidth: 0
    }]
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectSvc: ProjectService,
    private projectCtx: ProjectContextService,
    private subsystemSvc: SubsystemService,
    private requirementsSvc: RequirementsService,
    private testcasesSvc: TestCasesService
  ) {}

  ngOnInit(): void {
    const id = this.projectCtx.getProjectId();
    if (id) {
      this.projectId = id;
      this.loadProject(id);
      this.loadSubsystemMetrics(id);
      this.loadRequirementMetrics(id);
      this.loadTestCaseMetrics(id);
    }
  }

  loadProject(id: number) {
    this.projectSvc.getProjectById(id).subscribe({
      next: (data) => {
        this.project = {
          ...data,
          start_date: data.start_date?.split('T')[0] ?? '',
          end_date: data.end_date?.split('T')[0] ?? ''
        };
      },
      error: (err) => console.error('Failed to load project', err),
    });
  }

  loadSubsystemMetrics(projectId: number) {
    this.subsystemSvc.getSubsystemCount(projectId).subscribe({
      next: (data) => this.subsystemCount = data.total_subsystems,
      error: (err) => console.error('Failed to load subsystem count', err)
    });
  
    this.subsystemSvc.getRequirementCountPerSubsystem(projectId).subscribe({
      next: (data) => {
        this.subsystemRequirementCounts = data;
        this.subsystemRequirementChartData.labels = this.subsystemRequirementCounts.map(d => d.subsystem_name);
        this.subsystemRequirementChartData.datasets[0].data = this.subsystemRequirementCounts.map(d => d.requirement_count);
      },
      error: (err) => console.error('Failed to load requirements per subsystem', err)
    });
  }

  loadRequirementMetrics(projectId: number) {
    this.requirementsSvc.getRequirementCount(projectId).subscribe({
      next: (data) => this.requirementCount = data.total_requirements,
      error: (err) => console.error('Failed to get requirement count', err)
    });
  
    this.requirementsSvc.getRequirementCountByStatus(projectId).subscribe({
      next: (data) => {
        this.requirementStatusCounts = data;
        this.requirementStatusChartData.labels = this.requirementStatusCounts.map(d => d.status);
        this.requirementStatusChartData.datasets[0].data = this.requirementStatusCounts.map(d => d.count);
        this.requirementStatusChartData.datasets[0].backgroundColor = this.requirementStatusCounts.map(
          d => this.statusColorMap[d.status]
        );
      },
      error: (err) => console.error('Failed to get requirement status counts', err)
    });
  
    this.requirementsSvc.getRequirementCountByPriority(projectId).subscribe({
      next: (data) => {
        this.requirementPriorityCounts = data;
        this.requirementPriorityChartData.labels = this.requirementPriorityCounts.map(d => d.priority);
        this.requirementPriorityChartData.datasets[0].data = this.requirementPriorityCounts.map(d => d.count);
        this.requirementPriorityChartData.datasets[0].backgroundColor = this.requirementPriorityCounts.map(
          d => this.priorityColorMap[d.priority]
        );
      },
      error: (err) => console.error('Failed to get requirement priority counts', err)
    });
  }

  loadTestCaseMetrics(projectId: number) {
    this.testcasesSvc.getTestCaseCount(projectId).subscribe({
      next: (data) => this.testCaseCount = data.total_test_cases,
      error: (err) => console.error('Failed to get test case count', err)
    });
  
    this.testcasesSvc.getTestCaseCountByStatus(projectId).subscribe({
      next: (data) => {
        this.testCaseStatusCounts = data;
        this.testCaseStatusChartData.labels = this.testCaseStatusCounts.map(d => d.status.replace(/_/g, ' '));
        this.testCaseStatusChartData.datasets[0].data = this.testCaseStatusCounts.map(d => d.count);
        this.testCaseStatusChartData.datasets[0].backgroundColor = this.testCaseStatusCounts.map(
          d => this.testCaseStatusColorMap[d.status]
        );
      },
      error: (err) => console.error('Failed to get test case status counts', err)
    });
  
    this.testcasesSvc.getTestCasePassPercentage(projectId).subscribe({
      next: (data) => {
        this.testCasePassPercentage = data.percent_passed
        this.gaugeChartData.datasets[0].data = [this.testCasePassPercentage, 100 - this.testCasePassPercentage];
      },
      error: (err) => console.error('Failed to get test case pass percentage', err)
    });
  }

  editProject(id: number) {
    this.router.navigate([`/projects/${id}/edit`]);
  }
}
