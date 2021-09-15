export function saveStringOnStorage(model_name: string, value: string): void {
	sessionStorage.setItem(model_name, value);
}

export function retrieveStringFromStorage(model_name: string): string {
	return sessionStorage.getItem(model_name);
}

export function saveObjectOnStorage(model_name: string, model: any): void {
	sessionStorage.setItem(model_name, JSON.stringify(model));
}

export function saveObjectOnStoragePreRemove(model_name: string, model: any): void {
	sessionStorage.removeItem(model_name);
	sessionStorage.setItem(model_name, JSON.stringify(model));
}

export function retrieveObjectFromStorage(model_name: string): any {
	return JSON.parse(sessionStorage.getItem(model_name));
}

export function removeStringFromStorage(model_name: string): void {
	sessionStorage.removeItem(model_name);
}

export function setAppToken(model_name: string, value: string) {
	if (value == null) {
		removeStringFromStorage(model_name);
	}
	else {
		saveStringOnStorage(model_name, value);
	}
} 


export function clearStorage(): void {
	sessionStorage.clear();
	localStorage.clear();
}