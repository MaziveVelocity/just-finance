let db;
const request = indexedDB.open('just-finance', 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;
    db.createObjectStore('transactions', { autoIncrement: true });
}

request.onsuccess = function (event) {
    db = event.target.result;

    if (navigator.onLine) {
        uploadTransaction();
    }
};

request.onerror = function (event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(['transactions'], 'readwrite');
    const pizzaObjectStore = transaction.objectStore('transactions');
    pizzaObjectStore.add(record);
}

function uploadTransaction() {
    const transaction = db.transaction(['transactions'], 'readwrite');
    const transactionObjectStore = transaction.objectStore('transactions');
    const getAll = transactionObjectStore.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json()).then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction(['transactions'], 'readwrite');
                const transactionStore = transaction.objectStore('transactions');
                transactionStore.clear();
            }).catch(err => {
                console.log(err);
            });
        }
    };
}

window.addEventListener('online', uploadTransaction);
