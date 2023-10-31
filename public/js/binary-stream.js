function generateRandomBinary() {
    return Math.random() < 0.5 ? '0' : '1';
}

const binaryStream1Elements = document.querySelectorAll('.binary-stream1');
const binaryStream2Elements = document.querySelectorAll('.binary-stream2');
const columnLength = 100; // Adjust the number of digits in the column as needed

function updateBinaryColumn(binaryElements) {
    binaryElements.forEach((binaryElement) => {
        let newColumn = '';
        for (let i = 0; i < columnLength; i++) {
            newColumn += generateRandomBinary() + '<br>';
        }
        binaryElement.innerHTML = newColumn;
    });
}

// Update both sets of binary streams periodically (e.g., every 1 second)
setInterval(() => updateBinaryColumn(binaryStream1Elements), 500);
setInterval(() => updateBinaryColumn(binaryStream2Elements), 500);
