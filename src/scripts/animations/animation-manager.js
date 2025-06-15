// Animation Manager for 3D scene animations and objects
export class AnimationManager {
  constructor(sceneSetup) {
    this.sceneSetup = sceneSetup;
    this.scene = sceneSetup.getScene();
    this.camera = sceneSetup.getCamera();
    
    // Scene objects
    this.mainObject = null;
    this.particles = null;
    this.starField = null;
    this.orbitingObjects = [];
    this.constellationLines = null;
    
    // Animation state
    this.animationMixer = null;
    this.currentSection = 'about';
    this.cameraAnimationId = null;
    this.originalCameraPosition = new THREE.Vector3(0, 0, 20);
    this.originalControlsTarget = new THREE.Vector3(0, 0, 0);
    
    // Interactive features
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.hoveredObject = null;
    this.selectedProject = null;
    this.isProjectShowcaseMode = false;
    
    // Project and skill data
    this.projectData = {
      0: {
        title: "AutoVid - AI Video Generator",
        description: "Developed an AI application as a group project with Mendix low code platform for auto video generation based on user prompts. Features intelligent content creation and automated video production.",
        technologies: ["Mendix", "AI/ML", "Low-Code", "Video Generation"],
        category: "AI Project",
      },
      1: {
        title: "Interactive 3D Portfolio",
        description: "Modern portfolio website built with Three.js featuring immersive 3D graphics, smooth animations, and responsive design. Showcases technical skills through interactive web experiences.",
        technologies: ["Three.js", "WebGL", "JavaScript", "Responsive Design"],
        category: "Web Development",
      },
      2: {
        title: "Database Management System",
        description: "Comprehensive database solution with optimized queries and data visualization. Implemented efficient data structures and user-friendly interfaces.",
        technologies: ["SQL", "Database Design", "Data Visualization"],
        category: "Backend",
      },
      3: {
        title: "Responsive Web Design",
        description: "Modern, mobile-first web applications with clean UI/UX design. Focus on accessibility and cross-platform compatibility.",
        technologies: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
        category: "Frontend",
      },
    };

    this.skillCategories = {
      4: { name: "Problem Solving", color: 0x4f46e5, description: "Analytical thinking and creative solutions" },
      5: { name: "Graphic Design", color: 0x10b981, description: "Visual design and creative aesthetics" },
      6: { name: "AI Development", color: 0xf59e0b, description: "Machine learning and AI applications" },
      7: { name: "Web Technologies", color: 0xef4444, description: "Modern web development stack" },
      8: { name: "Database Systems", color: 0x8b5cf6, description: "Data management and optimization" },
      9: { name: "Low-Code Platforms", color: 0x06b6d4, description: "Rapid application development" },
      10: { name: "Version Control", color: 0xf97316, description: "Git and collaborative development" },
      11: { name: "UI/UX Design", color: 0xec4899, description: "User experience and interface design" },
    };
  }

  // Create all scene objects
  async createSceneObjects() {
    this.setupRealisticLighting();
    this.createMainObject();
    this.createEnhancedParticleSystem();
    this.createStarField();
    this.createOrbitingObjects();
    this.createConstellationLines();
    
    this.sceneSetup.updateLoadingProgress(3);
  }

  // Setup realistic lighting
  setupRealisticLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);

    // Main directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = !this.sceneSetup.isMobile;
    if (directionalLight.castShadow) {
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 50;
    }
    this.scene.add(directionalLight);

    // Rim lights for dramatic effect
    const rimLight1 = new THREE.DirectionalLight(0x4f46e5, 0.3);
    rimLight1.position.set(-10, 5, -5);
    this.scene.add(rimLight1);

    const rimLight2 = new THREE.DirectionalLight(0x10b981, 0.2);
    rimLight2.position.set(5, -10, 5);
    this.scene.add(rimLight2);

    // Point lights for accent
    const pointLight1 = new THREE.PointLight(0xf59e0b, 0.5, 20);
    pointLight1.position.set(8, 8, 8);
    this.scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xef4444, 0.3, 15);
    pointLight2.position.set(-8, -8, 8);
    this.scene.add(pointLight2);
  }

  // Create main central object
  createMainObject() {
    const group = new THREE.Group();
    
    // Central sphere with advanced material
    const sphereGeometry = new THREE.SphereGeometry(2, 64, 64);
    const sphereMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x4f46e5,
      metalness: 0.7,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.0,
      transparent: true,
      opacity: 0.9,
    });
    
    const centralSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    centralSphere.castShadow = true;
    centralSphere.receiveShadow = true;
    centralSphere.userData = { type: 'centralSphere', clickable: true };
    group.add(centralSphere);

    // Orbiting rings
    for (let i = 0; i < 3; i++) {
      const ringGeometry = new THREE.RingGeometry(3 + i * 0.5, 3.2 + i * 0.5, 64);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: [0x4f46e5, 0x10b981, 0xf59e0b][i],
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2 + (i * 0.2);
      ring.rotation.y = i * 0.3;
      group.add(ring);
    }

    // Add floating dust/energy particles around main object
    this.createFloatingDust(group);

    this.mainObject = group;
    this.scene.add(group);
  }

  // Create floating dust particles
  createFloatingDust(parentGroup) {
    const dustCount = this.sceneSetup.isMobile ? 50 : 100;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3;
      const radius = 4 + Math.random() * 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      dustPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      dustPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      dustPositions[i3 + 2] = radius * Math.cos(phi);

      const color = new THREE.Color().setHSL(0.6 + Math.random() * 0.4, 0.7, 0.6);
      dustColors[i3] = color.r;
      dustColors[i3 + 1] = color.g;
      dustColors[i3 + 2] = color.b;
    }

    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));

    const dustMaterial = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    const dust = new THREE.Points(dustGeometry, dustMaterial);
    dust.userData = { type: 'dust' };
    parentGroup.add(dust);
  }

  // Create enhanced particle system
  createEnhancedParticleSystem() {
    const particleCount = this.sceneSetup.isMobile ? 500 : 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      positions[i3] = (Math.random() - 0.5) * 100;
      positions[i3 + 1] = (Math.random() - 0.5) * 100;
      positions[i3 + 2] = (Math.random() - 0.5) * 100;

      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.6 + 0.4, 0.7, 0.6);
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 2 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    this.particles = new THREE.Points(geometry, material);
    this.particles.userData = { type: 'particles' };
    this.scene.add(this.particles);
  }

  // Create star field background
  createStarField() {
    const starCount = this.sceneSetup.isMobile ? 800 : 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = 80 + Math.random() * 120;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const intensity = Math.random() * 0.5 + 0.5;
      colors[i3] = intensity;
      colors[i3 + 1] = intensity;
      colors[i3 + 2] = intensity;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.5,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    });

    this.starField = new THREE.Points(geometry, material);
    this.starField.userData = { type: 'stars' };
    this.scene.add(this.starField);
  }

  // Create orbiting objects (projects and skills)
  createOrbitingObjects() {
    this.orbitingObjects = [];
    const radius = 8;
    const totalObjects = 8; // 4 projects + 4 skills

    for (let i = 0; i < totalObjects; i++) {
      const angle = (i / totalObjects) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 4;

      let geometry, material, userData;

      if (i < 4) {
        // Project objects
        geometry = new THREE.BoxGeometry(1, 1, 1);
        material = new THREE.MeshPhysicalMaterial({
          color: [0x4f46e5, 0x10b981, 0xf59e0b, 0xef4444][i],
          metalness: 0.5,
          roughness: 0.3,
          transparent: true,
          opacity: 0.8,
        });
        userData = { 
          type: 'project', 
          id: i, 
          clickable: true,
          projectData: this.projectData[i],
          originalPosition: new THREE.Vector3(x, y, z)
        };
      } else {
        // Skill objects
        const skillId = i;
        geometry = new THREE.OctahedronGeometry(0.8);
        material = new THREE.MeshPhysicalMaterial({
          color: this.skillCategories[skillId].color,
          metalness: 0.7,
          roughness: 0.2,
          transparent: true,
          opacity: 0.7,
        });
        userData = { 
          type: 'skill', 
          id: skillId, 
          clickable: true,
          skillData: this.skillCategories[skillId],
          originalPosition: new THREE.Vector3(x, y, z)
        };
      }

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(x, y, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.userData = userData;

      this.orbitingObjects.push(mesh);
      this.scene.add(mesh);
    }
  }

  // Create constellation lines
  createConstellationLines() {
    const geometry = new THREE.BufferGeometry();
    const positions = [];

    // Connect some orbiting objects with lines
    for (let i = 0; i < this.orbitingObjects.length - 1; i += 2) {
      const obj1 = this.orbitingObjects[i];
      const obj2 = this.orbitingObjects[i + 1];

      positions.push(obj1.position.x, obj1.position.y, obj1.position.z);
      positions.push(obj2.position.x, obj2.position.y, obj2.position.z);
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.LineBasicMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.3,
    });

    this.constellationLines = new THREE.LineSegments(geometry, material);
    this.scene.add(this.constellationLines);
  }

  // Update animations
  update() {
    if (this.mainObject) {
      this.mainObject.rotation.y += 0.005;
      this.mainObject.children[0].rotation.x += 0.01; // Central sphere
      
      // Animate rings
      for (let i = 1; i <= 3; i++) {
        if (this.mainObject.children[i]) {
          this.mainObject.children[i].rotation.z += 0.01 * (i * 0.5);
        }
      }
    }

    // Animate particles
    if (this.particles) {
      this.particles.rotation.y += 0.002;
      this.particles.rotation.x += 0.001;
    }

    // Animate star field
    if (this.starField) {
      this.starField.rotation.y += 0.0005;
    }

    // Animate orbiting objects
    this.orbitingObjects.forEach((obj, index) => {
      const time = Date.now() * 0.001;
      const radius = 8;
      const speed = 0.5 + index * 0.1;
      const angle = (index / this.orbitingObjects.length) * Math.PI * 2 + time * speed * 0.1;
      
      obj.position.x = Math.cos(angle) * radius;
      obj.position.z = Math.sin(angle) * radius;
      obj.rotation.x += 0.01;
      obj.rotation.y += 0.02;
    });

    // Update constellation lines
    this.updateConstellationLines();

    // Animate dust particles
    if (this.mainObject && this.mainObject.children.length > 4) {
      const dust = this.mainObject.children[4];
      if (dust && dust.userData.type === 'dust') {
        dust.rotation.y += 0.003;
        dust.rotation.x += 0.002;
      }
    }
  }

  // Update constellation lines
  updateConstellationLines() {
    if (this.constellationLines && this.orbitingObjects.length > 0) {
      const positions = [];
      for (let i = 0; i < this.orbitingObjects.length - 1; i += 2) {
        const obj1 = this.orbitingObjects[i];
        const obj2 = this.orbitingObjects[i + 1];

        positions.push(obj1.position.x, obj1.position.y, obj1.position.z);
        positions.push(obj2.position.x, obj2.position.y, obj2.position.z);
      }
      this.constellationLines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    }
  }

  // Handle section changes
  onSectionChange(section) {
    this.currentSection = section;
    this.animateCameraForSection(section);
  }

  // Animate camera for different sections
  animateCameraForSection(section) {
    const camera = this.camera;
    const controls = this.sceneSetup.getControls();
    
    let targetPosition, targetLookAt;

    switch (section) {
      case 'about':
        targetPosition = new THREE.Vector3(0, 0, 20);
        targetLookAt = new THREE.Vector3(0, 0, 0);
        break;
      case 'skills':
        targetPosition = new THREE.Vector3(15, 10, 15);
        targetLookAt = new THREE.Vector3(0, 0, 0);
        break;
      case 'projects':
        targetPosition = new THREE.Vector3(-15, 5, 20);
        targetLookAt = new THREE.Vector3(0, 0, 0);
        break;
      case 'contact':
        targetPosition = new THREE.Vector3(0, 15, 25);
        targetLookAt = new THREE.Vector3(0, 0, 0);
        break;
      default:
        targetPosition = new THREE.Vector3(0, 0, 20);
        targetLookAt = new THREE.Vector3(0, 0, 0);
    }

    // Smooth camera animation
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    const duration = 2000;
    const startTime = Date.now();

    const animateCamera = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = this.easeInOutCubic(progress);

      camera.position.lerpVectors(startPosition, targetPosition, eased);
      controls.target.lerpVectors(startTarget, targetLookAt, eased);
      controls.update();

      if (progress < 1) {
        requestAnimationFrame(animateCamera);
      }
    };

    animateCamera();
  }

  // Easing function
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Handle object interactions
  onMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    // Reset hover effects
    if (this.hoveredObject) {
      this.resetHoverEffect(this.hoveredObject);
      this.hoveredObject = null;
    }

    // Find clickable objects
    for (let intersect of intersects) {
      if (intersect.object.userData.clickable) {
        this.hoveredObject = intersect.object;
        this.applyHoverEffect(intersect.object);
        document.body.style.cursor = 'pointer';
        return;
      }
    }

    document.body.style.cursor = 'default';
  }

  // Apply hover effect
  applyHoverEffect(object) {
    if (object.material) {
      object.material.emissive = new THREE.Color(0x222222);
      object.scale.setScalar(1.1);
    }
  }

  // Reset hover effect
  resetHoverEffect(object) {
    if (object.material) {
      object.material.emissive = new THREE.Color(0x000000);
      object.scale.setScalar(1.0);
    }
  }

  // Handle clicks
  onClick(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);

    for (let intersect of intersects) {
      if (intersect.object.userData.clickable) {
        this.handleObjectClick(intersect.object);
        break;
      }
    }
  }

  // Handle object clicks
  handleObjectClick(object) {
    const userData = object.userData;

    if (userData.type === 'centralSphere') {
      // Return to about section
      if (window.uiManager) {
        window.uiManager.switchSection('about');
      }
    } else if (userData.type === 'project') {
      // Show project details
      if (window.uiManager) {
        window.uiManager.showProjectShowcase(userData.projectData);
      }
    } else if (userData.type === 'skill') {
      // Show skill tooltip or details
      console.log('Clicked skill:', userData.skillData.name);
    }
  }

  // Get all scene objects for raycasting
  getInteractableObjects() {
    const objects = [];
    
    if (this.mainObject) {
      objects.push(this.mainObject.children[0]); // Central sphere
    }
    
    objects.push(...this.orbitingObjects);
    
    return objects;
  }
} 