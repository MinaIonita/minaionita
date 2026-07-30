const API="http://localhost:4000/api";
const tok = (await (await fetch(`${API}/auth/login`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:"mina.ionita1@gmail.com",password:"schimba-ma-acum"})})).json()).token;
const H={"Content-Type":"application/json","Authorization":"Bearer "+tok};
const post=(p,b)=>fetch(`${API}${p}`,{method:"POST",headers:H,body:b?JSON.stringify(b):undefined}).then(r=>r.json());
const get=(p)=>fetch(`${API}${p}`,{headers:H}).then(r=>r.json());

// 1. create project
const proj = await post("/admin/projects",{clientName:"Client Test SRL", companyName:"Test SRL", siteUrl:"https://test.ro", stage:"LIVE"});
console.log("1. project created:", proj.id ? "✓ "+proj.clientName : JSON.stringify(proj));

// 2. add a credential with a secret password
const secret = "P@rola-Secreta-123!";
const cred = await post(`/admin/projects/${proj.id}/credentials`,{label:"wp-admin", username:"admin", password:secret, loginUrl:"https://test.ro/wp-admin"});
console.log("2. credential added:", cred.id ? "✓ "+cred.label : JSON.stringify(cred));

// 3. get project -> credentials must be MASKED (no password field)
const full = await get(`/admin/projects/${proj.id}`);
const c = full.credentials[0];
console.log("3. get project credentials masked:", (c && !('password' in c) && !('passwordEnc' in c)) ? "✓ (no password leaked)" : "✗ LEAK: "+JSON.stringify(c));

// 4. verify DB stores ENCRYPTED, not plaintext (reveal returns plaintext)
const rev = await post(`/admin/credentials/${cred.id}/reveal`);
console.log("4. reveal decrypts correctly:", rev.password === secret ? "✓" : "✗ got: "+rev.password);

// 5. check access was logged
