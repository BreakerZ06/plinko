'use client'
import React, { useEffect } from 'react'

/*babylonjs*/
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera"
import { Engine } from "@babylonjs/core/Engines/engine"
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight"
import { Vector3 } from "@babylonjs/core/Maths/math.vector"
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder"
import { CreateSphere } from "@babylonjs/core/Meshes/Builders/sphereBuilder"
import { CreateCylinder } from "@babylonjs/core/Meshes/Builders/cylinderBuilder"
import { Scene } from "@babylonjs/core/scene"
import { GridMaterial } from "@babylonjs/materials/grid/gridMaterial"
import { DeviceSourceManager, DeviceType, PhysicsImpostor } from '@babylonjs/core'
import { HavokPhysics } from "@babylonjs/havok"
//import getHavoc from './havoc'




const PlinkoGame = () => {
    let havocInterface
    HavokPhysics().then((havok)=>{
        havocInterface = havok
    })

    useEffect(() => {
        // const havokInterface = getHavoc()
        
        const canvas = document.getElementById('renderCanvas')
        const createEngine = (canvas) => {
            const engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true, disableWebGL2Support: false })
            return engine
        }

        const createScene = (engine) => {
            const scene = new Scene(engine)
            const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene)
            camera.setTarget(Vector3.Zero())
            camera.attachControl(canvas, true)
            camera.inputs.remove(camera.inputs.attached.keyboard);
            const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene)
            light.intensity = 0.7
            return scene
        }

        const engine = createEngine(canvas)
        const scene = createScene(engine)
        scene.enablePhysics(new Vector3(0, -9.81, 0), havokInterface)

        const dsm = new DeviceSourceManager(scene.getEngine())
        dsm.onDeviceConnectedObservable.add((e) => {
            if (e.deviceType != DeviceType.Keyboard) {
                console.log('invalid input source')
                return
            }
            const keyboard = dsm.getDeviceSource(DeviceType.keyboard)
            scene.beforeRender = () => {
                const w = keyboard.getInput(87)
                const a = keyboard.getInput(65)
                const s = keyboard.getInput(83)
                const d = keyboard.getInput(68)
                const rotationalSpeed = 0.002;
                if (w === 1) {
                    camera.cameraRotation.x -= rotationalSpeed;
                }
                if (a === 1) {
                    camera.cameraRotation.y -= rotationalSpeed;
                }
                if (s === 1) {
                    camera.cameraRotation.x += rotationalSpeed;
                }
                if (d === 1) {
                    camera.cameraRotation.y += rotationalSpeed;
                }
            }
        })
        const peg = []

        // rows
        for (let i = -5; i <= 5; i++) {
            //cols
            for (let j = -5; j <= (5 * i); j++) {
                const x = i * 1.2
                const z = j * 1.2
                const position = new Vector3(x, 0, z)
                const peg = CreateCylinder('peg', { diameter: 0.2, height: 0.5 }, scene);
                peg.position = position;
                peg.physicsImpostor = new PhysicsImpostor(peg, PhysicsImpostor.CylinderImpostor, { mass: 0, restitution: 0.8 }, scene);
            }
        }

        // Create a grid material
        const material = new GridMaterial("grid", scene)

        const sphere = CreateSphere("sphere1", { segments: 16, diameter: 2 }, scene)
        sphere.position.y = 2
        sphere.material = material

        const ground = CreateGround("ground1", { width: 6, height: 6, subdivisions: 2 }, scene)
        ground.material = material



        engine.runRenderLoop(() => {
            scene.render()
        })
        window.addEventListener('resize', () => {
            engine.resize()
        })

        return () => {

        }
    }, [])
    return (
        <>
            <canvas id="renderCanvas" touch-action="none" style={{ width: '100%', heigth: '100%' }}></canvas>
        </>
    )
}

export { PlinkoGame }
export default PlinkoGame