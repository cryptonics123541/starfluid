let scene, camera, renderer, controls, model;
let isInitialized = false;

function initViewer() {
    if (isInitialized) return;
    
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a192f); // Dark blue background

    // Setup camera with closer initial position
    camera = new THREE.PerspectiveCamera(60, window.innerWidth * 0.8 / (window.innerHeight * 0.8), 0.1, 1000);
    camera.position.set(0, 0, 3); // Much closer initial position

    // Setup renderer
    const container = document.getElementById('model-container');
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x0a192f, 1);
    container.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 4);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);

    const pointLight = new THREE.PointLight(0xffffff, 3);
    pointLight.position.set(0, 2, 2);
    scene.add(pointLight);

    // Import OrbitControls from Three.js modules
    const OrbitControls = THREE.OrbitControls;
    
    // Setup controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = true;
    controls.minDistance = 0.5;
    controls.maxDistance = 10;
    controls.target.set(0, 0, 0);
    controls.update();

    // Import GLTFLoader from Three.js modules
    const GLTFLoader = THREE.GLTFLoader;
    
    // Load model
    const loader = new GLTFLoader();
    loader.load(
        '/models/harbinger.glb',
        function (gltf) {
            model = gltf.scene;
            
            // Center the model
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            model.position.sub(center);
            
            // Make the model larger
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 8 / maxDim;
            model.scale.multiplyScalar(scale);

            // Rotate the model for better initial view
            model.rotation.y = Math.PI / 4;
            model.rotation.x = Math.PI / 16;

            scene.add(model);

            // Position camera to look at model
            const boundingBox = new THREE.Box3().setFromObject(model);
            const modelCenter = boundingBox.getCenter(new THREE.Vector3());
            controls.target.copy(modelCenter);
            controls.update();
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