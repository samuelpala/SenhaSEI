chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url.includes('sip.df.gov.br')) {
    chrome.scripting.executeScript({
      target: { tabId },
      func: () => {
        // Função para corrigir o campo de senha
        const fixPasswordField = (observer) => {
          const inputField = document.getElementById('pwdSenha');

          if (inputField) {
            // Remove o campo mascarado e recria o campo real
            const parent = inputField.parentNode;

            // Cria um novo campo de senha
            const newPasswordField = document.createElement('input');
            newPasswordField.type = 'password';
            newPasswordField.id = 'pwdSenha';
            newPasswordField.name = inputField.name;
            newPasswordField.className = inputField.className;
            newPasswordField.placeholder = inputField.placeholder;
            newPasswordField.tabIndex = inputField.tabIndex;
            newPasswordField.value =
              inputField._realfield?.value || inputField.value;

            // Define o autocomplete como "on"
            newPasswordField.setAttribute('autocomplete', 'on');

            // Substitui o campo antigo
            parent.replaceChild(newPasswordField, inputField);

            console.log(
              'Campo de senha substituído por um campo real com autocomplete="on".'
            );

            // Desconecta o MutationObserver após a substituição
            observer.disconnect();
          }
        };

        // Configuração do MutationObserver
        const observer = new MutationObserver(() => {
          fixPasswordField(observer);
        });

        // Inicia o observador no documento
        observer.observe(document.body, {
          childList: true,
          subtree: true,
        });

        // Aplica a correção inicial
        fixPasswordField(observer);
      },
    });
  }
});
