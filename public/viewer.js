let scene, camera, renderer, controls, model;
let isInitialized = false;

function initViewer() {
    if (isInitialized) return;
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111); // Slightly lighter than pure black

    // Setup camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth * 0.8 / (window.innerHeight * 0.8), 0.1, 1000);
    camera.position.set(0, 2, 8); // Better camera position

    // Setup renderer
    const container = document.getElementById('model-container');
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 3); // Brighter ambient light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 4); // Brighter main light
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Add additional light from another angle
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);

    // Add controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;  // Allow closer zoom
    controls.maxDistance = 20; // Allow further zoom
    controls.target.set(0, 0, 0);
    controls.update();

    // Load model
    const loader = new THREE.GLTFLoader();
    loader.load(
        '/models/harbinger.glb', // Update this path to where you store the GLB file
        function (gltf) {
            model = gltf.scene;
            
            // Center the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            
            // Scale model to fit view
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 5 / maxDim; // Increased scale factor
            model.scale.multiplyScalar(scale);

            // Rotate the model slightly
            model.rotation.y = Math.PI / 4; // 45-degree rotation

            scene.add(model);
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('An error happened:', error);
        }
    );

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
    
    isInitialized = true;
}

function onWindowResize() {
    const container = document.getElementById('model-container');
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Update the toggleSchematicViewer function
function toggleSchematicViewer() {
    const viewer = document.getElementById('schematicViewer');
    if (viewer.style.display === 'none' || !viewer.style.display) {
        viewer.style.display = 'flex';
        if (!isInitialized) {
            initViewer();
        }
    } else {
        viewer.style.display = 'none';
    }
}