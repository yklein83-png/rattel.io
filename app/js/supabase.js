/**
 * Supabase Client for RATTEL.IO
 * Handles authentication, database, and storage operations
 */

const SUPABASE_URL = 'https://mfqhiqudbvwtblqlcysz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mcWhpcXVkYnZ3dGJscWxjeXN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5Mzc4OTUsImV4cCI6MjA4MTUxMzg5NX0._sZl3USA5DXDw_6XEUnV4eHHksfzXY7VQwjZnqUTGG4';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Authentication Functions
 */

// Sign up new user
async function signUp(email, password) {
    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password
    });
    if (error) throw error;
    return data;
}

// Sign in user
async function signIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });
    if (error) throw error;
    return data;
}

// Sign out user
async function signOut() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
}

// Get current session
async function getSession() {
    const { data: { session }, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    return session;
}

// Get current user
async function getUser() {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error) throw error;
    return user;
}

/**
 * Profile Functions
 */

// Create user profile
async function createProfile(userId, profileData) {
    const { data, error } = await supabaseClient
        .from('profiles')
        .insert([{ id: userId, ...profileData }]);
    if (error) throw error;
    return data;
}

// Get user profile
async function getProfile(userId) {
    const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
}

// Update user profile
async function updateProfile(userId, profileData) {
    const { data, error } = await supabaseClient
        .from('profiles')
        .update(profileData)
        .eq('id', userId);
    if (error) throw error;
    return data;
}

// Get all profiles (admin)
async function getAllProfiles() {
    const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
}

/**
 * Document Functions
 */

// Upload document to storage
async function uploadDocument(userId, docType, file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}/${docType}_${Date.now()}.${fileExt}`;

    const { data, error } = await supabaseClient.storage
        .from('documents')
        .upload(fileName, file);

    if (error) throw error;
    return { path: fileName, ...data };
}

// Save document metadata to database
async function saveDocumentMetadata(userId, docType, fileName, filePath, fileSize) {
    const { data, error } = await supabaseClient
        .from('documents')
        .upsert([{
            user_id: userId,
            type: docType,
            file_name: fileName,
            file_path: filePath,
            file_size: fileSize,
            status: 'pending',
            uploaded_at: new Date().toISOString()
        }], { onConflict: 'user_id,type' });
    if (error) throw error;
    return data;
}

// Get user documents
async function getUserDocuments(userId) {
    const { data, error } = await supabaseClient
        .from('documents')
        .select('*')
        .eq('user_id', userId);
    if (error) throw error;
    return data;
}

// Get document URL (signed URL for private bucket)
async function getDocumentUrl(filePath) {
    const { data, error } = await supabaseClient.storage
        .from('documents')
        .createSignedUrl(filePath, 3600); // 1 hour expiry
    if (error) throw error;
    return data.signedUrl;
}

/**
 * Admin Functions
 */

// Update user status (admin)
async function updateUserStatus(userId, status) {
    const updateData = { status: status };
    if (status === 'verified') {
        updateData.verified_at = new Date().toISOString();
    }
    const { data, error } = await supabaseClient
        .from('profiles')
        .update(updateData)
        .eq('id', userId);
    if (error) throw error;
    return data;
}

// Update document status (admin)
async function updateDocumentStatus(docId, status) {
    const { data, error } = await supabaseClient
        .from('documents')
        .update({ status: status })
        .eq('id', docId);
    if (error) throw error;
    return data;
}

// Listen for auth state changes
supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
        // Clear any local storage
        sessionStorage.removeItem('rattel_user');
    }
});
