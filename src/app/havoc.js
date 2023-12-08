'use server'
import { HavokPhysics } from "@babylonjs/havok"

const getHavoc = async () => {
    const havokInterface = await HavokPhysics()
    const HavokPlugin = new HavokPlugin(true, havokInterface)
    return HavokPlugin
}

export default getHavoc