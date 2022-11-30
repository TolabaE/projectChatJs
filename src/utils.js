import { fileURLToPath } from "url";
import { dirname } from "path";

//este codigo me permite tomar la ruta absoluta y que siempre la encuentre.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;
