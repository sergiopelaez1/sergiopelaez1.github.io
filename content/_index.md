---
sections:
- block: about.biography
  content:
    title: Biography
    username: admin
  id: about

- block: collection
  content:
    title: Peer-Reviewed Publications
    filters:
      folders:
        - publication
      tag: 'peer-reviewed'
    sort_by: 'Date'
    sort_ascending: false
  design:
    view: citation
  id: publications

- block: collection
  content:
    title: Preprints & Working Papers
    filters:
      folders:
        - publication
      tag: 'working-paper'
    sort_by: 'Date'
    sort_ascending: false
  design:
    view: citation
  id: preprints

- block: collection
  content:
    title: Work in Progress
    filters:
      folders:
        - publication
      tag: 'work-in-progress'
    sort_by: 'Date'
    sort_ascending: false
  design:
    view: citation
  id: wip

- block: contact
  content:
    title: Contact
    text: Feel free to reach out for research collaborations, consulting opportunities, or questions about my work.
    email: sergiopelaezsierra@gmail.com
    autolink: true
  design:
    columns: '2'
  id: contact

title: ""
type: landing
---
