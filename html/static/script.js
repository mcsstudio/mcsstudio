const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("threeCanvas"), alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

document.body.style.background = "linear-gradient(to bottom, #000428, #004e92)"; // Gradient nền giống The Field

document.body.style.overflow = "hidden"; // Ẩn thanh cuộn

theCanvas = document.getElementById("threeCanvas");
theCanvas.style.position = "absolute";
theCanvas.style.zIndex = "1";

document.getElementById("effectButton").style.zIndex = "2"; // Đưa nút lên trên

document.getElementById("effectButton").style.position = "absolute";
document.getElementById("effectButton").style.left = "50%";
document.getElementById("effectButton").style.top = "50%";
document.getElementById("effectButton").style.transform = "translate(-50%, -50%)";
document.getElementById("effectButton").style.padding = "15px 30px";
document.getElementById("effectButton").style.borderRadius = "30px";
document.getElementById("effectButton").style.background = "rgba(255, 255, 255, 0.2)";
document.getElementById("effectButton").style.color = "white";
document.getElementById("effectButton").style.border = "1px solid rgba(255, 255, 255, 0.5)";
document.getElementById("effectButton").style.backdropFilter = "blur(10px)";
document.getElementById("effectButton").style.transition = "transform 0.3s ease";
document.getElementById("effectButton").addEventListener("mouseover", () => {
    document.getElementById("effectButton").style.transform = "scale(1.1)";
});
document.getElementById("effectButton").addEventListener("mouseout", () => {
    document.getElementById("effectButton").style.transform = "scale(1)";
});

const particlesCount = 1000;
const positions = new Float32Array(particlesCount * 3);
const velocities = new Float32Array(particlesCount * 3);
const colors = new Float32Array(particlesCount * 3);

const particlesGeometry = new THREE.BufferGeometry();
for (let i = 0; i < particlesCount * 3; i += 3) {
    let x = (Math.random() - 0.5) * 6;
    let y = (Math.random() - 0.5) * 6;
    let z = (Math.random() - 0.5) * 6 - 3;

    positions[i] = x;
    positions[i + 1] = y;
    positions[i + 2] = z;

    velocities[i] = (Math.random() - 0.5) * 0.2;
    velocities[i + 1] = (Math.random() - 0.5) * 0.2;
    velocities[i + 2] = (Math.random() - 0.5) * 0.2;

    colors[i] = 0.8 + Math.random() * 0.2;
    colors[i + 1] = 0.8 + Math.random() * 0.2;
    colors[i + 2] = 0.8 + Math.random() * 0.2;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
particlesGeometry.attributes.color.needsUpdate = true;

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false
});

const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
particleMesh.visible = false;
scene.add(particleMesh);
camera.position.set(0, 0, 7);

document.addEventListener("mousemove", (event) => {
    let x = (event.clientX / window.innerWidth) * 2 - 1;
    let y = -(event.clientY / window.innerHeight) * 2 + 1;
    particleMesh.rotation.x += y * 0.05;
    particleMesh.rotation.y += x * 0.05;
});

document.getElementById("effectButton").addEventListener("click", () => {
    particleMesh.visible = true;
    let startTime = Date.now();
    let duration = 3000;
    function updateParticles() {
        let elapsedTime = Date.now() - startTime;
        let progress = elapsedTime / duration;
        if (progress > 1) return;

        for (let i = 0; i < particlesCount * 3; i++) {
            positions[i] += velocities[i] * (1 - progress);
        }
        particlesGeometry.attributes.position.needsUpdate = true;
        requestAnimationFrame(updateParticles);
    }
    updateParticles();
    document.getElementById("effectButton").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("effectButton").style.display = "none";
    }, 1000);
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();
