// Create the scene
const scene = new THREE.Scene();

// Set the background to a space texture
const loader = new THREE.TextureLoader();
loader.load('./space.jpg', function(texture) {
    scene.background = texture;
});

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create a renderer and attach it to the document
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a cube with textured sides
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const textureLoader = new THREE.TextureLoader();
const cubeMaterials = [
    new THREE.MeshBasicMaterial({ map: textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/wall.jpg') }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/flower-1.jpg') }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/flower-2.jpg') }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/flower-3.jpg') }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/flower-4.jpg') }),
    new THREE.MeshBasicMaterial({ map: textureLoader.load('https://threejsfundamentals.org/threejs/resources/images/flower-5.jpg') }),
];
const cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
scene.add(cube);

// Add lighting to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);

// Create a pulsating light
const pulsatingLight = new THREE.PointLight(0x44ff44, 2, 50);
pulsatingLight.position.set(0, 5, 0);
scene.add(pulsatingLight);

// Create a sphere (planet) with a textured surface
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const planetTexture = textureLoader.load('./earth.jpg'); // Planet texture
const sphereMaterial = new THREE.MeshBasicMaterial({ map: planetTexture });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(2, 0, 0);
scene.add(sphere);

// Create a plane (ground) with a textured surface
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const groundTexture = textureLoader.load('./moon.jpg'); // Moon surface texture
const planeMaterial = new THREE.MeshPhongMaterial({ map: groundTexture });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.position.y = -1.5;
scene.add(plane);

// Create rotating 3D text
const fontLoader = new THREE.FontLoader();
fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function(font) {
    const textGeometry = new THREE.TextGeometry('Hello, Three.js!', {
        font: font,
        size: 0.5,
        height: 0.1,
    });
    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(-3, 1.5, 0);
    scene.add(textMesh);

    // Animate the text rotation
    function animateText() {
        textMesh.rotation.y += 0.01;
        requestAnimationFrame(animateText);
    }
    animateText();
});

// Create a torus (ring) around the cube
const torusGeometry = new THREE.TorusGeometry(1.5, 0.1, 16, 100);
const torusMaterial = new THREE.MeshBasicMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
scene.add(torus);

// Create a field of rotating asteroids
const asteroidGeometry = new THREE.SphereGeometry(0.1, 8, 8);
const asteroidMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
const asteroids = [];
for (let i = 0; i < 50; i++) {
    const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);
    asteroid.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 10
    );
    asteroid.rotationSpeed = Math.random() * 0.05;
    scene.add(asteroid);
    asteroids.push(asteroid);
}

// Create a starfield using particles
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
const starVertices = [];
for (let i = 0; i < 1000; i++) {
    starVertices.push((Math.random() - 0.5) * 1000);
    starVertices.push((Math.random() - 0.5) * 1000);
    starVertices.push((Math.random() - 0.5) * 1000);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Animation variables
let rotationSpeed = 0.01;
let colorChange = false;
let orbitRadius = 2;

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube
    cube.rotation.x += rotationSpeed;
    cube.rotation.y += rotationSpeed;

    // Orbit the sphere (planet) around the cube
    const time = Date.now() * 0.001;
    sphere.position.x = Math.cos(time) * orbitRadius;
    sphere.position.z = Math.sin(time) * orbitRadius;

    // Rotate the torus (ring)
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;

    // Rotate the asteroids
    asteroids.forEach(asteroid => {
        asteroid.rotation.x += asteroid.rotationSpeed;
        asteroid.rotation.y += asteroid.rotationSpeed;
    });

    // Pulsate the light
    pulsatingLight.intensity = 1 + Math.sin(time * 5);

    // Render the scene
    renderer.render(scene, camera);
}

// Event listeners
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

window.addEventListener('wheel', (event) => {
    // Increase or decrease rotation speed based on scroll direction
    rotationSpeed += event.deltaY * -0.0001;
});

window.addEventListener('click', () => {
    // Change the cube's material color on click
    colorChange = !colorChange;
    cube.material.forEach(material => {
        material.color.set(colorChange ? 0xff0000 : 0xffffff); // Red if clicked, white if not
    });
});

// Start the animation loop
animate();
