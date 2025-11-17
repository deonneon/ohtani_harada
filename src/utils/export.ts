import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { MatrixData } from '../types';
import {
  calculateOverallProgress,
  calculateAreaProgress,
} from './progress';

/**
 * Export options for different formats
 */
export interface ExportOptions {
  /** Export format */
  format: 'png' | 'jpeg' | 'pdf';
  /** Include title and date */
  includeTitle?: boolean;
  /** Include footer */
  includeFooter?: boolean;
  /** Content to include */
  contentType?: 'full' | 'summary' | 'completed-only';
  /** Quality for image formats (0-1) */
  quality?: number;
  /** Custom title */
  title?: string;
}

/**
 * Default export options
 */
export const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  format: 'png',
  includeTitle: true,
  includeFooter: true,
  contentType: 'full',
  quality: 0.95,
  title: 'Harada Method Matrix',
};

/**
 * Generate a timestamped filename for export
 */
export function generateExportFilename(
  format: 'png' | 'jpeg' | 'pdf',
  title?: string
): string {
  const timestamp = new Date().toISOString().slice(0, 16).replace(/[:.]/g, '-');
  const baseName = (title || 'harada-matrix')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-');
  return `${baseName}-${timestamp}.${format}`;
}

/**
 * Export the matrix as an image using Canvas API
 */
export async function exportAsImage(
  element: HTMLElement,
  options: ExportOptions = DEFAULT_EXPORT_OPTIONS
): Promise<void> {
  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2, // Higher resolution
      useCORS: true,
      allowTaint: false,
      logging: false,
    });

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error('Failed to generate image blob');
        }

        // Create download link
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = generateExportFilename(options.format, options.title);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },
      `image/${options.format}`,
      options.quality
    );
  } catch (error) {
    console.error('Image export failed:', error);
    throw new Error('Failed to export image. Please try again.');
  }
}

/**
 * Export the matrix as a PDF document
 */
export async function exportAsPDF(
  matrixData: MatrixData,
  options: ExportOptions = { ...DEFAULT_EXPORT_OPTIONS, format: 'pdf' }
): Promise<void> {
  try {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Add title
    if (options.includeTitle) {
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(options.title || 'Harada Method Matrix', margin, yPosition);
      yPosition += 15;

      // Add date
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `Generated: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        margin,
        yPosition
      );
      yPosition += 10;
    }

    // Add summary statistics
    const overallProgress = calculateOverallProgress(matrixData);
    const completedTasks = matrixData.tasks.filter(
      (t) => t.status === 'completed'
    ).length;
    const totalTasks = matrixData.tasks.length;

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Summary Statistics', margin, yPosition);
    yPosition += 8;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text(
      `Overall Progress: ${Math.round(overallProgress * 100)}% (${completedTasks}/${totalTasks} tasks)`,
      margin,
      yPosition
    );
    yPosition += 6;
    pdf.text(`Focus Areas: ${matrixData.focusAreas.length}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Goal: ${matrixData.goal.title}`, margin, yPosition);
    yPosition += 10;

    // Add goal section
    if (options.contentType === 'full' || options.contentType === 'summary') {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Goal', margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');

      // Split goal description into lines that fit the page width
      const goalLines = pdf.splitTextToSize(
        matrixData.goal.description,
        pageWidth - 2 * margin
      );
      pdf.text(goalLines, margin, yPosition);
      yPosition += goalLines.length * 5 + 5;
    }

    // Add focus areas section
    if (options.contentType === 'full') {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Focus Areas', margin, yPosition);
      yPosition += 8;

      matrixData.focusAreas.forEach((area, index) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = margin;
        }

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${index + 1}. ${area.title}`, margin, yPosition);
        yPosition += 6;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');

        const areaProgress = calculateAreaProgress(matrixData, area.id);
        const areaTasks = matrixData.tasks.filter((t) => t.areaId === area.id);
        const completedAreaTasks = areaTasks.filter(
          (t) => t.status === 'completed'
        ).length;

        pdf.text(
          `Progress: ${Math.round(areaProgress * 100)}% (${completedAreaTasks}/${areaTasks.length} tasks)`,
          margin + 5,
          yPosition
        );
        yPosition += 5;

        const descriptionLines = pdf.splitTextToSize(
          area.description,
          pageWidth - 2 * margin - 5
        );
        pdf.text(descriptionLines, margin + 5, yPosition);
        yPosition += descriptionLines.length * 4 + 3;

        // Add tasks for this area
        if (areaTasks.length > 0) {
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'bold');
          pdf.text('Tasks:', margin + 10, yPosition);
          yPosition += 5;

          areaTasks.forEach((task) => {
            // Check if we need a new page
            if (yPosition > pageHeight - 20) {
              pdf.addPage();
              yPosition = margin;
            }

            const statusIcon =
              task.status === 'completed'
                ? '✓'
                : task.status === 'in-progress'
                  ? '→'
                  : '○';
            const priorityIcon =
              task.priority === 'high'
                ? '🔴'
                : task.priority === 'medium'
                  ? '🟡'
                  : '🔵';

            pdf.setFont('helvetica', 'normal');
            pdf.text(
              `${statusIcon} ${priorityIcon} ${task.title}`,
              margin + 15,
              yPosition
            );

            if (task.description) {
              yPosition += 4;
              const taskDescLines = pdf.splitTextToSize(
                task.description,
                pageWidth - 2 * margin - 20
              );
              pdf.setFontSize(9);
              pdf.text(taskDescLines, margin + 20, yPosition);
              yPosition += taskDescLines.length * 3.5;
            } else {
              yPosition += 4;
            }

            yPosition += 2; // Extra spacing between tasks
          });
        }

        yPosition += 8; // Extra spacing between areas
      });
    }

    // Add completed tasks summary
    if (options.contentType === 'completed-only') {
      const completedTasks = matrixData.tasks.filter(
        (t) => t.status === 'completed'
      );

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Completed Tasks (${completedTasks.length})`, margin, yPosition);
      yPosition += 8;

      completedTasks.forEach((task) => {
        // Check if we need a new page
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = margin;
        }

        const areaName =
          matrixData.focusAreas.find((a) => a.id === task.areaId)?.title ||
          'Unknown Area';
        const priorityIcon =
          task.priority === 'high'
            ? '🔴'
            : task.priority === 'medium'
              ? '🟡'
              : '🔵';

        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${priorityIcon} ${task.title}`, margin, yPosition);
        yPosition += 5;

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Area: ${areaName}`, margin + 5, yPosition);
        yPosition += 4;

        if (task.description) {
          const taskDescLines = pdf.splitTextToSize(
            task.description,
            pageWidth - 2 * margin - 5
          );
          pdf.text(taskDescLines, margin + 5, yPosition);
          yPosition += taskDescLines.length * 3.5 + 2;
        }

        if (task.completedDate) {
          pdf.setFontSize(8);
          pdf.setTextColor(100, 100, 100);
          pdf.text(
            `Completed: ${task.completedDate.toLocaleDateString()}`,
            margin + 5,
            yPosition
          );
          pdf.setTextColor(0, 0, 0);
          yPosition += 4;
        }

        yPosition += 3; // Spacing between tasks
      });
    }

    // Add footer
    if (options.includeFooter) {
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Harada Method Matrix - Page ${i} of ${pageCount}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
        pdf.setTextColor(0, 0, 0);
      }
    }

    // Save the PDF
    pdf.save(generateExportFilename('pdf', options.title));
  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error('Failed to export PDF. Please try again.');
  }
}

/**
 * Main export function that handles both image and PDF export
 */
export async function exportMatrix(
  matrixData: MatrixData,
  gridElement: HTMLElement | null,
  options: ExportOptions = DEFAULT_EXPORT_OPTIONS
): Promise<void> {
  if (options.format === 'pdf') {
    await exportAsPDF(matrixData, options);
  } else {
    if (!gridElement) {
      throw new Error('Grid element is required for image export');
    }
    await exportAsImage(gridElement, options);
  }
}
