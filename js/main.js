const db = new PouchDB('cryptoDB');

document.addEventListener('DOMContentLoaded', function () {
  var loginModal = document.getElementById('loginModal');

  loginModal.addEventListener('transitionend', function (event) {
    if (event.propertyName === 'display' && loginModal.style.display === 'none') {
      $("#lpwd").prop("disabled", "");
      $("#lpwd").val("").removeClass("is-valid is-invalid");
      $("#lbtn").html("Salvar").addClass("button").removeClass("btn-success");
    }
  });
});

function loginToServer() {
  var value = $("#lpwd").val();
  if (value.length == 0) { $("#lpwd").addClass("is-invalid"); return; }
  $("#lpwd").prop("disabled", "true");
  $("#lbtn").prop("disabled", "true");
  storeHashedPassword(value);
  closeLoginModal();
  location.reload();
}
$("#lpwd").keyup(function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    loginToServer();
  }
});

function openLoginModal() {
  document.getElementById("loginModal").showModal();
}

function closeLoginModal() {
  document.getElementById("loginModal").close();
}

function hashPassword(password) {
  return CryptoJS.SHA256(password).toString();
}

async function storeHashedPassword(password) {
  const hashedPwd = hashPassword(password);

  try {
    let doc;
    try {
      doc = await db.get('hashedPwd');
      await db.put({
        _id: 'hashedPwd',
        _rev: doc._rev,
        data: hashedPwd
      });
    } catch (err) {
      if (err.status === 404) {
        await db.put({
          _id: 'hashedPwd',
          data: hashedPwd
        });
      } else {
        throw err;
      }
    }
    console.log('Senha hash armazenada com sucesso:', hashedPwd);
  } catch (err) {
    console.error('Erro ao armazenar senha hash:', err);
  }
}

async function verifyPassword(password) {
  const hashedPwd = hashPassword(password);

  try {
    const doc = await db.get('hashedPwd');
    if (doc.data === hashedPwd) {
      console.log('Senha verificada com sucesso.');
    } else {
      console.log('Senha incorreta.');
    }
  } catch (err) {
    console.error('Erro ao verificar senha:', err);
  }
}

async function getHashPwd() {
  try {
    const doc = await db.get('hashedPwd');
    if (doc.data) {
      const keyElement = document.createElement('div');
      keyElement.type = 'hidden';
      keyElement.id = 'key';
      keyElement.value = doc.data;

      const encryptForm = document.getElementById('encryptForm');
      encryptForm.appendChild(keyElement);
    } else {
      console.log('Falha ao criar elemento: hash não encontrada');
    }
  } catch (err) {
    console.error('Erro ao verificar senha:', err);
  }
}

async function removeStoredData() {
  try {
    const doc = await db.get('hashedPwd');
    await db.remove(doc);
    reloadEncryptor();
  } catch (err) {
    console.error('Erro ao remover dados criptografados:', err);
  }
}

async function checkEncryptedDataExists() {
  try {
    const doc = await db.get('hashedPwd');
    return true;
  } catch (err) {
    if (err.status === 404) {
      return false;
    } else {
      throw err;
    }
  }
}

async function reloadEncryptor() {
  const exists = await checkEncryptedDataExists();
  const encryptor = document.getElementById('encryptor');

  if (exists) {
    encryptor.classList.remove('hidden');
    document.title = 'Encryptor';
    getHashPwd();
  } else {
    document.title = 'Encryptor - Nova Senha';
    openLoginModal();
    return;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  reloadEncryptor();
});