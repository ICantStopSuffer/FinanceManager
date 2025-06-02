import React, { useState, useEffect } from 'react';
import './Reports.css';

const Reports = () => {
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        type: '',
        startDate: '',
        endDate: '',
        categoryId: ''
    });

    const [format, setFormat] = useState('CSV');
    const [filePreview, setFilePreview] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetch('https://api.minote.ru/inex/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));
    }, []);

    const handleDownload = (format) => {
        setFormat(format);
        const token = localStorage.getItem('token');

        fetch('https://api.minote.ru/inex/download-report', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ ...filters, format })
        })
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `transactions.${format.toLowerCase()}`;
                link.click();
            })
            .catch(err => console.error(err));
    };

    const handleFileUpload = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);

            if (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
                setFilePreview("Предпросмотр для Excel файлов невозможен.");
            } else {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const contents = e.target.result;
                    setFilePreview(contents);
                };
                reader.readAsText(selectedFile);
            }
        }
    };

    const handleFileSubmit = () => {
        if (!filePreview) {
            alert("Пожалуйста, выберите файл для загрузки.", "error");
            return;
        }

        const parsedData = parseFileToJson(filePreview);
        console.log(parsedData);

        const token = localStorage.getItem('token');

        fetch('https://api.minote.ru/inex/upload-report', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parsedData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert("Данные успешно загружены!", "success");
                } else {
                    alert("Ошибка при загрузке данных.", "error");
                }
            })
            .catch(err => {
                console.error(err);
                alert("Ошибка при загрузке данных.", "error");
            });
    };

    const parseFileToJson = (fileContent) => {
        const rows = fileContent.split('\n');

        const parsedData = rows
            .map(row => {
                const columns = row.split(',');

                if (columns.length < 6) return null;

                let rawType = columns[1]?.replace('Тип:', '').trim();
                const rawAmount = columns[2]?.replace('Сумма:', '').trim();
                const rawDescription = columns[3]?.replace('Описание:', '').trim();
                const rawCategory = columns[4]?.replace('Категория:', '').trim();
                const rawDate = columns[5]?.replace('Дата:', '').trim();

                const type = rawType === 'Доход' ? 'income' :
                    rawType === 'Расход' ? 'expense' : rawType;

                const [day, month, year] = rawDate.split('/');
                const formattedDate = `${year}-${month}-${day}`;

                return {
                    type,
                    amount: parseFloat(rawAmount),
                    description: rawDescription,
                    category: rawCategory,
                    date: formattedDate
                };
            })
            .filter(row => row !== null);

        return parsedData;
    };

    return (
        <div className="MainReports">
            <h2>Отчеты</h2>

            <div className="buttons-container">
                <button className="download-btn" onClick={() => handleDownload('CSV')}>Скачать в CSV</button>
                <button className="download-btn" onClick={() => handleDownload('JSON')}>Скачать в JSON</button>
                <button className="download-btn" onClick={() => handleDownload('TXT')}>Скачать в TXT</button>
                <button className="download-btn" onClick={() => handleDownload('PDF')}>Скачать в PDF</button>
                <button className="download-btn" onClick={() => handleDownload('EXCEL')}>Скачать в EXCEL</button>
            </div>

            <div className="upload-container">
                <input type="file" accept=".csv,.txt,.xlsx" onChange={handleFileUpload} />
                <div className="file-preview">
                    <h3>Предпросмотр файла:</h3>
                    <pre>{filePreview}</pre>
                </div>
                <button className="upload-btn" onClick={handleFileSubmit}>Загрузить</button>
            </div>
        </div>
    );
};

export default Reports;