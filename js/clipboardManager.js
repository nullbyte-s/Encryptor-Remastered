$(document).foundation();
function copyToClipboard(elementId) {
    var element = document.getElementById(elementId);
    element.select();
    element.setSelectionRange(0, 99999);

    document.execCommand("copy");

    var copyButtons = document.querySelectorAll('[id^="copyButton"]');
    copyButtons.forEach(function (copyButton) {
        copyButton.textContent = "✔️ Copiado!";
        copyButton.classList.add("button-copied");

        setTimeout(function () {
            copyButton.textContent = "Copiar";
            copyButton.classList.remove("button-copied");
        }, 1500);
    });
}
function pasteFromClipboard() {
    navigator.clipboard.readText().then(function (text) {
        var activeTabId = document.querySelector('.tabs-title.is-active a').getAttribute('href');
        var textareaId = activeTabId === '#encryptTab' ? 'encrypt' : 'decrypt';

        document.getElementById(textareaId).value = text;
    });
}