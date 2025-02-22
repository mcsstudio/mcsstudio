const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("threeCanvas"), alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load font để tạo chữ bằng ShapeGeometry
const loader = new THREE.FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
    const textShapes = font.generateShapes("MCS Studio", 1);
    const textGeometry = new THREE.ShapeGeometry(textShapes);
    textGeometry.center();
    
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(textMesh);

    gsap.from(textMesh.position, { duration: 2, y: -2, ease: "power2.out" });
    gsap.from(textMesh.material, { duration: 2, opacity: 0, ease: "power2.out" });
});

// Tạo hiệu ứng hạt chuyển động nhẹ
const particlesCount = 1000;
const positions = new Float32Array(particlesCount * 3);
const velocities = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
    velocities[i] = (Math.random() - 0.5) * 0.01;
}

const particlesGeometry = new THREE.BufferGeometry();
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xaaaaaa,
    transparent: true,
    opacity: 0.7
});

const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleMesh);
camera.position.set(0, 0, 5);

// Hiệu ứng animation mượt
function animate() {
    requestAnimationFrame(animate);
    
    const positions = particleMesh.geometry.attributes.position.array;
    for (let i = 0; i < particlesCount * 3; i++) {
        positions[i] += velocities[i];
        if (positions[i] > 5 || positions[i] < -5) velocities[i] *= -1;
    }
    particleMesh.geometry.attributes.position.needsUpdate = true;
    
    particleMesh.rotation.x += 0.0005;
    particleMesh.rotation.y += 0.0005;
    
    renderer.render(scene, camera);
}
animate();
