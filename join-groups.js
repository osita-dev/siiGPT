let groups = JSON.parse(localStorage.getItem('groups')) || [];
const groupList = document.getElementById('group-list');

renderGroups();

function renderGroups() {
  const availableGroups = groups.filter(g => g.members.length < g.maxMembers);

  if (availableGroups.length === 0) {
    groupList.innerHTML = `<p style="color:#ccc;text-align:center;">No available groups to join.</p>`;
    return;
  }

  groupList.innerHTML = availableGroups.map(g => `
    <div class="group-item">
      <div class="group-info">
        <strong>${g.name}</strong>
        <small>${g.subject} • ${g.members.length}/7 members</small>
      </div>
      <button class="join-btn" data-id="${g.id}">Join</button>
    </div>
  `).join('');

  document.querySelectorAll('.join-btn').forEach(btn => {
    btn.addEventListener('click', () => joinGroup(Number(btn.dataset.id)));
  });
}

function joinGroup(id) {
  const group = groups.find(g => g.id === id);
  if (!group) return;

  if (group.members.length >= group.maxMembers) {
    alert("This group is full.");
    renderGroups();
    return;
  }

  group.members.push(`User${group.members.length + 1}`);
  localStorage.setItem('groups', JSON.stringify(groups));

  if (group.members.length >= group.maxMembers) {
    alert(`Group "${group.name}" is now full and locked!`);
  }

  // Redirect to group chat
  window.location.href = `inClass.html?group=${id}`;
}
