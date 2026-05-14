export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  generateReport(reportType, user, items) {
    // 1. Prepara os dados (regras de negócio isoladas)
    const processedItems = this.filterAndProcessItems(items, user);

    // 2. Delega a geração para o método específico do formato
    if (reportType === 'CSV') {
      return this.generateCSV(user, processedItems);
    } else if (reportType === 'HTML') {
      return this.generateHTML(user, processedItems);
    }

    return '';
  }

  // Extração: Responsável apenas por filtrar os dados por usuário
  filterAndProcessItems(items, user) {
    if (user.role === 'ADMIN') {
      return items.map(item => {
        if (item.value > 1000) {
          item.priority = true;
        }
        return item;
      });
    } else if (user.role === 'USER') {
      return items.filter(item => item.value <= 500);
    }
    return [];
  }

  // Extração: Responsável apenas por montar a string CSV
  generateCSV(user, items) {
    let report = 'ID,NOME,VALOR,USUARIO\n';
    let total = 0;

    for (const item of items) {
      report += `${item.id},${item.name},${item.value},${user.name}\n`;
      total += item.value;
    }

    report += '\nTotal,,\n';
    report += `${total},,\n`;

    return report.trim();
  }

  // Extração: Responsável apenas por montar as tags HTML
  generateHTML(user, items) {
    let report = '<html><body>\n';
    report += '<h1>Relatório</h1>\n';
    report += `<h2>Usuário: ${user.name}</h2>\n`;
    report += '<table>\n';
    report += '<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n';

    let total = 0;

    for (const item of items) {
      const style = item.priority ? ' style="font-weight:bold;"' : '';
      report += `<tr${style}><td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
      total += item.value;
    }

    report += '</table>\n';
    report += `<h3>Total: ${total}</h3>\n`;
    report += '</body></html>\n';

    return report.trim();
  }
}