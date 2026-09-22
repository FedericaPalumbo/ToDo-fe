// Formatta la dueDate per la visualizzazione (es. "12/05/2025")
export function formatDate(date: string | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('it-IT');
}

// Converte una datepicker (ngbDate) in stringa formato ISO (yyyy-mm-dd)
export function DateToString(ngbDate: { year: number, month: number, day: number }): string {
    const mm = String(ngbDate.month).padStart(2, '0'); //.padStart(2, '0');  in caso di mese/giorno ad 1 cifra: aggiunge uno 0 davanti per evitare eventuali errori
    const dd = String(ngbDate.day).padStart(2, '0');
    return `${ngbDate.year}-${mm}-${dd}`;
}
