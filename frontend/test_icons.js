import fs from 'fs'
const pkg = JSON.parse(fs.readFileSync('package.json'))
console.log("react:", pkg.dependencies.react)
import { Bot, User, Loader2, Send, MessageCircle, X } from 'lucide-react'
console.log(!!Bot, !!User, !!Loader2, !!Send, !!MessageCircle, !!X)
