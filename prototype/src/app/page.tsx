"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type Member = { id: number; name: string };
type GroupSummary = {
  id: number;
  name: string;
  _count: { members: number; expenses: number };
};
type Share = { memberId: number; amountCents: number; member: Member };
type Expense = {
  id: number;
  description: string;
  amountCents: number;
  createdAt: string;
  payer: Member;
  shares: Share[];
};
type GroupDetail = {
  id: number;
  name: string;
  members: Member[];
  expenses: Expense[];
};

const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

async function requestJson<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error ?? "Something went wrong. Please try again.");
  return data as T;
}

export default function Home() {
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [group, setGroup] = useState<GroupDetail | null>(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState<number[]>([]);
  const [groupName, setGroupName] = useState("");
  const [memberName, setMemberName] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [payerId, setPayerId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    requestJson<GroupSummary[]>("/api/groups")
      .then((data) => {
        if (!active) return;
        setGroups(data);
        const savedId = Number(window.localStorage.getItem("splitsmart-group"));
        setSelectedGroupId(
          data.some((item) => item.id === savedId) ? savedId : data[0]?.id ?? null,
        );
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Could not load groups.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedGroupId) {
      setGroup(null);
      return;
    }
    window.localStorage.setItem("splitsmart-group", String(selectedGroupId));
    let active = true;
    requestJson<GroupDetail>(`/api/groups/${selectedGroupId}`)
      .then((data) => {
        if (!active) return;
        setGroup(data);
        setPayerId((current) =>
          data.members.some((member) => String(member.id) === current)
            ? current
            : String(data.members[0]?.id ?? ""),
        );
        setSelectedMemberIds(data.members.map((member) => member.id));
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : "Could not load this group.");
      });
    return () => {
      active = false;
    };
  }, [selectedGroupId]);

  async function refreshGroups() {
    const data = await requestJson<GroupSummary[]>("/api/groups");
    setGroups(data);
  }

  async function refreshGroup(groupId: number) {
    const data = await requestJson<GroupDetail>(`/api/groups/${groupId}`);
    setGroup(data);
    setPayerId((current) =>
      data.members.some((member) => String(member.id) === current)
        ? current
        : String(data.members[0]?.id ?? ""),
    );
    await refreshGroups();
  }

  async function createGroup(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const created = await requestJson<{ id: number }>("/api/groups", {
        method: "POST",
        body: JSON.stringify({ name: groupName }),
      });
      setGroupName("");
      await refreshGroups();
      setSelectedGroupId(created.id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not create group.");
    } finally {
      setSaving(false);
    }
  }

  async function addMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedGroupId) return;
    setError("");
    setSaving(true);
    try {
      await requestJson(`/api/groups/${selectedGroupId}/members`, {
        method: "POST",
        body: JSON.stringify({ name: memberName }),
      });
      setMemberName("");
      await refreshGroup(selectedGroupId);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not add member.");
    } finally {
      setSaving(false);
    }
  }

  async function addExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedGroupId) return;
    setError("");
    setSaving(true);
    try {
      await requestJson(`/api/groups/${selectedGroupId}/expenses`, {
        method: "POST",
        body: JSON.stringify({
          description,
          amount,
          payerId: Number(payerId),
          participantIds: selectedMemberIds,
        }),
      });
      setDescription("");
      setAmount("");
      await refreshGroup(selectedGroupId);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save expense.");
    } finally {
      setSaving(false);
    }
  }

  const balances = new Map<number, number>();
  for (const member of group?.members ?? []) balances.set(member.id, 0);
  for (const expense of group?.expenses ?? []) {
    balances.set(expense.payer.id, (balances.get(expense.payer.id) ?? 0) + expense.amountCents);
    for (const share of expense.shares) {
      balances.set(share.memberId, (balances.get(share.memberId) ?? 0) - share.amountCents);
    }
  }
  const totalSpent = (group?.expenses ?? []).reduce((total, expense) => total + expense.amountCents, 0);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/" aria-label="SplitSmart home">
          <span className="brand-mark">S</span>
          <span>split<span>smart</span></span>
        </Link>

        <div className="sidebar-heading">
          <span>Your groups</span>
          <span className="group-count">{groups.length}</span>
        </div>
        <nav className="group-nav" aria-label="Groups">
          {groups.map((item) => (
            <button
              className={`group-nav-item${item.id === selectedGroupId ? " is-active" : ""}`}
              key={item.id}
              onClick={() => {
                setError("");
                setSelectedGroupId(item.id);
              }}
              type="button"
            >
              <span className="group-initial">{item.name.charAt(0).toUpperCase()}</span>
              <span className="group-nav-copy">
                <strong>{item.name}</strong>
                <small>{item._count.members} members</small>
              </span>
              <span className="nav-arrow" aria-hidden="true">›</span>
            </button>
          ))}
          {!loading && groups.length === 0 && <p className="sidebar-empty">Your groups will show up here.</p>}
        </nav>

        <form className="new-group-form" onSubmit={createGroup}>
          <label htmlFor="group-name">Create a group</label>
          <div className="input-with-button">
            <input
              id="group-name"
              maxLength={60}
              onChange={(event) => setGroupName(event.target.value)}
              placeholder="e.g. Apartment 4B"
              required
              value={groupName}
            />
            <button className="icon-button" disabled={saving} title="Create group" type="submit" aria-label="Create group">+</button>
          </div>
        </form>
        <div className="sidebar-footer"><span className="status-dot" /> All changes saved</div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><span className="breadcrumb-divider">/</span><strong>{group?.name ?? "Groups"}</strong></div>
          <div className="local-badge"><span className="status-dot" /> Local workspace</div>
        </header>

        <div className="page-content">
          {error && <div className="alert" role="alert"><span>{error}</span><button aria-label="Dismiss error" onClick={() => setError("")} type="button">×</button></div>}
          {loading ? (
            <div className="loading-state">Loading your workspace…</div>
          ) : !group ? (
            <section className="welcome-state">
              <div className="welcome-art" aria-hidden="true"><span>+</span><span>−</span><span>÷</span></div>
              <p className="eyebrow">A little more together</p>
              <h1>Shared plans.<br />Clear balances.</h1>
              <p className="welcome-copy">Create a group to keep shared expenses and everyone&apos;s running total in one place.</p>
              <form className="welcome-form" onSubmit={createGroup}>
                <label htmlFor="first-group-name">Give your group a name</label>
                <div className="welcome-form-row">
                  <input id="first-group-name" maxLength={60} onChange={(event) => setGroupName(event.target.value)} placeholder="Weekend cabin, roommates…" required value={groupName} />
                  <button className="primary-button" disabled={saving} type="submit">Create group <span aria-hidden="true">→</span></button>
                </div>
              </form>
            </section>
          ) : (
            <>
              <section className="page-heading">
                <div>
                  <p className="eyebrow">Group overview</p>
                  <h1>{group.name}</h1>
                  <p className="heading-subtitle">Keep the shared spending easy to follow.</p>
                </div>
                <span className="heading-date">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              </section>

              <section className="stat-row" aria-label="Group totals">
                <div className="stat-block"><span className="stat-label">Total spent</span><strong>{money(totalSpent)}</strong><small>Across all recorded expenses</small></div>
                <div className="stat-block"><span className="stat-label">Members</span><strong>{group.members.length.toString().padStart(2, "0")}</strong><small>In this group</small></div>
                <div className="stat-block"><span className="stat-label">Expenses</span><strong>{group.expenses.length.toString().padStart(2, "0")}</strong><small>Shared so far</small></div>
              </section>

              <div className="dashboard-grid">
                <div className="main-column">
                  <section className="section-panel members-panel">
                    <div className="section-heading">
                      <div><p className="eyebrow">The people</p><h2>Members <span className="heading-count">{group.members.length}</span></h2></div>
                      <span className="section-note">Everyone in this group</span>
                    </div>
                    <div className="member-list">
                      {group.members.map((member, index) => (
                        <div className="member-row" key={member.id}>
                          <span className={`avatar avatar-${index % 5}`}>{member.name.charAt(0).toUpperCase()}</span>
                          <span className="member-name">{member.name}{member.id === Number(payerId) && <small> · default payer</small>}</span>
                          <span className={`member-balance ${(balances.get(member.id) ?? 0) > 0 ? "positive" : (balances.get(member.id) ?? 0) < 0 ? "negative" : "neutral"}`}>
                            {(balances.get(member.id) ?? 0) > 0 ? "+" : ""}{money(balances.get(member.id) ?? 0)}
                          </span>
                        </div>
                      ))}
                      {group.members.length === 0 && <p className="empty-inline">Add the people who share expenses with you.</p>}
                    </div>
                    <form className="add-member-form" onSubmit={addMember}>
                      <input aria-label="Member name" maxLength={60} onChange={(event) => setMemberName(event.target.value)} placeholder="Add someone to the group" required value={memberName} />
                      <button className="text-button" disabled={saving} type="submit"><span aria-hidden="true">+</span> Add member</button>
                    </form>
                  </section>

                  <section className="section-panel history-panel">
                    <div className="section-heading">
                      <div><p className="eyebrow">The ledger</p><h2>Expense history</h2></div>
                      <span className="section-note">{group.expenses.length} {group.expenses.length === 1 ? "entry" : "entries"}</span>
                    </div>
                    {group.expenses.length ? (
                      <div className="expense-list">
                        {group.expenses.map((expense) => (
                          <article className="expense-row" key={expense.id}>
                            <span className="expense-symbol" aria-hidden="true">↗</span>
                            <div className="expense-copy"><strong>{expense.description}</strong><small>Paid by {expense.payer.name} <span>·</span> {new Date(expense.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</small></div>
                            <strong className="expense-amount">{money(expense.amountCents)}</strong>
                          </article>
                        ))}
                      </div>
                    ) : <div className="empty-history"><span aria-hidden="true">↗</span><p>No expenses yet</p><small>Your group&apos;s shared spending will appear here.</small></div>}
                  </section>
                </div>

                <div className="side-column">
                  <section className="section-panel balance-panel">
                    <div className="section-heading">
                      <div><p className="eyebrow">The score</p><h2>Balances</h2></div>
                      <span className="balance-icon" aria-hidden="true">↔</span>
                    </div>
                    <p className="balance-caption">After splitting every expense equally.</p>
                    <div className="balance-list">
                      {group.members.map((member) => {
                        const balance = balances.get(member.id) ?? 0;
                        return <div className="balance-row" key={member.id}><span>{member.name}</span><strong className={balance > 0 ? "positive" : balance < 0 ? "negative" : "neutral"}>{balance > 0 ? "+" : ""}{money(balance)}</strong></div>;
                      })}
                      {!group.members.length && <p className="empty-inline">Add group members to see balances.</p>}
                    </div>
                    <div className="balance-footnote"><span className="status-dot" /> Group balances always add up to $0.00</div>
                  </section>

                  <section className="section-panel expense-form-panel">
                    <div className="section-heading">
                      <div><p className="eyebrow">Add to the ledger</p><h2>New expense</h2></div>
                      <span className="form-mark" aria-hidden="true">$</span>
                    </div>
                    {group.members.length ? (
                      <form className="expense-form" onSubmit={addExpense}>
                        <label htmlFor="expense-description">What was it for?</label>
                        <input id="expense-description" maxLength={120} onChange={(event) => setDescription(event.target.value)} placeholder="Groceries, dinner…" required value={description} />
                        <div className="form-two-columns">
                          <div><label htmlFor="expense-amount">Amount</label><div className="currency-input"><span>$</span><input id="expense-amount" inputMode="decimal" onChange={(event) => setAmount(event.target.value)} placeholder="0.00" required type="number" min="0.01" step="0.01" value={amount} /></div></div>
                          <div><label htmlFor="expense-payer">Paid by</label><select id="expense-payer" onChange={(event) => setPayerId(event.target.value)} required value={payerId}>{group.members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select></div>
                        </div>
                        <fieldset className="participant-fieldset">
                          <legend>Split between</legend>
                          {group.members.map((member) => <label className="participant-option" key={member.id}><input checked={selectedMemberIds.includes(member.id)} onChange={(event) => setSelectedMemberIds((current) => event.target.checked ? [...current, member.id] : current.filter((id) => id !== member.id))} type="checkbox" /><span>{member.name}</span></label>)}
                        </fieldset>
                        <button className="primary-button submit-expense" disabled={saving} type="submit">{saving ? "Saving…" : "Record expense"}<span aria-hidden="true">→</span></button>
                      </form>
                    ) : <p className="form-empty">Add at least one member before recording an expense.</p>}
                  </section>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}