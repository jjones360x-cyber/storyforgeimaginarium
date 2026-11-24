// Dedicated Production Collective intake deployment.
const ROSTER_ENDPOINT = 'https://script.google.com/macros/s/AKfycbw5js4-xFwaNO2sU8Nt-skktaVpwBer9tM7NZHRkOCz00h3AyivbbQFZLfNH3p7kI-Szw/exec';
const form = document.getElementById('roster-form');
const button = document.getElementById('submit-roster');
const statusBox = document.getElementById('form-status');
let submissionId = crypto.randomUUID();
if (ROSTER_ENDPOINT) {button.disabled=false;statusBox.textContent='Applications are open for future paid project shortlists.';}
form.addEventListener('submit', async event => {
 event.preventDefault();
 if (!ROSTER_ENDPOINT || button.disabled) return;
 for (const n of [2,3]) {
  const url=form.elements['project'+n+'_url']; const role=form.elements['project'+n+'_role'];
  role.setCustomValidity(url.value && !role.value.trim() ? 'Describe your contribution to this project.' : '');
  url.setCustomValidity(role.value.trim() && !url.value ? 'Add the URL for this project.' : '');
 }
 if (!form.reportValidity()) return;
 button.disabled=true;button.textContent='Saving application…';
 const data=new URLSearchParams(new FormData(form));data.set('submission_id',submissionId);data.set('form_type','production_roster');
 try {
  const response=await fetch(ROSTER_ENDPOINT,{method:'POST',body:data});
  const result=await response.json();
  if(!response.ok || result.ok!==true || result.submission_id!==submissionId) throw new Error('Unconfirmed submission');
  statusBox.textContent='Application received. Your reference is '+submissionId+'. Thank you—we will contact you when a suitable project arises.';
  form.reset();submissionId=crypto.randomUUID();
 } catch(error) {statusBox.textContent='We could not confirm receipt. Your answers are still here. Please retry, or email Studio@StoryforgeImaginarium.com. A retry will use the same reference to avoid duplicates.';}
 finally {button.disabled=false;button.textContent='Submit Collective application';statusBox.scrollIntoView({behavior:'smooth',block:'center'});}
});
form.addEventListener('input', event => {if(event.target.setCustomValidity) event.target.setCustomValidity('');});
