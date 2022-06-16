
export class HistoryService {

    getTimeline() {
        return fetch('data/history.json').then(res => res.json())
                .then(d => d.data);
    }
}