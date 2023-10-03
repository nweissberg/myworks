
export default class HistoryService {

    getTimeline() {
        return fetch('data/history-en.json').then(res => res.json())
                .then(d => d.data);
    }
}